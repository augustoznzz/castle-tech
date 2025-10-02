import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripeFromEnv, buildStripeRequestOptions } from '@/lib/stripe'
import { sendProductKeysEmail } from '@/lib/email'
import { readFile, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { type Product } from '@/lib/mock-data'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Helper function to get and update product keys
async function processProductKeys(session: Stripe.Checkout.Session & { line_items?: Stripe.ApiList<Stripe.LineItem> | null }): Promise<{ productTitle: string; key: string }[]> {
  const PRODUCTS_FILE_PATH = path.join(process.cwd(), 'data', 'products.json')
  
  if (!existsSync(PRODUCTS_FILE_PATH)) {
    throw new Error('Products file not found')
  }

  const data = await readFile(PRODUCTS_FILE_PATH, 'utf-8')
  let products: Product[] = JSON.parse(data)
  const keysToSend: { productTitle: string; key: string }[] = []

  let metadataItems: { slug?: string; quantity?: number; title?: string }[] = []
  try {
    metadataItems = JSON.parse(session.metadata?.items || '[]')
  } catch {
    metadataItems = []
  }

  const lineItems = session.line_items?.data || []

  const getSlugFromHref = (href?: string) => href?.split('/').filter(Boolean).pop() || ''

  const findProduct = (slug?: string, title?: string) => {
    if (slug) {
      const bySlug = products.find(p => getSlugFromHref(p.href) === slug)
      if (bySlug) return bySlug
    }
    if (title) {
      const byTitle = products.find(p => p.title === title)
      if (byTitle) return byTitle
    }
    return undefined
  }

  const itemsToProcess = metadataItems.length
    ? metadataItems.map((item, index) => {
        const fallbackLineItem = lineItems[index]
        const fallbackTitle = (fallbackLineItem as any)?.description || fallbackLineItem?.price?.product || undefined
        return {
          slug: item.slug?.toString().trim() || undefined,
          quantity: Math.max(1, Number(item.quantity || fallbackLineItem?.quantity || 1)),
          title: item.title?.toString().trim() || fallbackTitle,
        }
      })
    : lineItems.map((lineItem) => ({
        slug: undefined,
        quantity: Math.max(1, Number(lineItem.quantity || 1)),
        title: ((lineItem as any)?.description as string | undefined) || undefined,
      }))

  for (const item of itemsToProcess) {
    const product = findProduct(item.slug, item.title)
    if (!product) {
      console.warn('Product not found for line item', item)
      continue
    }

    if (product.stockMode !== 'keys' && product.stockMode !== 'infinite') {
      console.warn(`Invalid stock mode for product: ${product.title}`)
      continue
    }

    if (!product.stockKeys || product.stockKeys.length === 0) {
      console.warn(`No keys available for product: ${product.title}`)
      continue
    }

    // For both infinite and limited stock, use existing keys in order
    // For infinite stock, keys are replenished automatically by admin
    const keysToTake = Math.min(item.quantity || 1, product.stockKeys.length)
    for (let i = 0; i < keysToTake; i++) {
      const key = product.stockKeys.shift()
      if (key) {
        keysToSend.push({ productTitle: product.title, key })
      }
    }

    products = products.map(p => (p.id === product.id ? product : p))
  }

  // Save updated products back to file
  await writeFile(PRODUCTS_FILE_PATH, JSON.stringify(products, null, 2))

  return keysToSend
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'Missing STRIPE_WEBHOOK_SECRET' }, { status: 500 })
  }

  const stripe = getStripeFromEnv()
  const opts = buildStripeRequestOptions()

  const rawBody = await req.text()
  const signature = req.headers.get('stripe-signature') as string | null

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature || '', secret)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${err?.message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Get full session details with line items
        const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['line_items']
        })

        const customerEmail = fullSession.customer_details?.email || fullSession.customer_email
        if (!customerEmail) {
          console.error('No customer email found in session')
          break
        }

        const lineItems = fullSession.line_items?.data || []
        if (lineItems.length === 0) {
          console.error('No line items found in session')
          break
        }

        // Process product keys
        const productKeys = await processProductKeys(fullSession)

        if (productKeys.length === 0) {
          console.warn('No product keys to send')
          break
        }

        // Send email with product keys
        const emailData = {
          customerEmail,
          customerName: fullSession.customer_details?.name || undefined,
          orderId: session.id,
          total: (session.amount_total || 0) / 100, // Convert from cents
          currency: session.currency || 'brl',
          productKeys
        }

        const emailSent = await sendProductKeysEmail(emailData)
        if (emailSent) {
          console.log(`Product keys email sent successfully to ${customerEmail}`)
        } else {
          console.error(`Failed to send product keys email to ${customerEmail}`)
        }

        break
      }
      case 'charge.succeeded':
      case 'payment_intent.succeeded':
      default:
        break
    }
    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: err?.message || 'Webhook handler error' }, { status: 500 })
  }
}


