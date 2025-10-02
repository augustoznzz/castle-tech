import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { type Product } from '@/lib/mock-data'
import { getStripeFromEnv, buildStripeRequestOptions } from '@/lib/stripe'
import { readFile, existsSync } from 'fs'
import { readFile as readFileAsync } from 'fs/promises'
import path from 'path'

function extractSlugFromHref(href: string): string {
  if (!href) return ''
  if (href.includes('#')) return href.split('#').pop() || ''
  const tail = href.split('/').pop() || ''
  return tail
}

export async function POST(req: NextRequest) {
  try {
    ;(globalThis as any).EDGE_RUNTIME = undefined
    const forwardedProto = req.headers.get('x-forwarded-proto') || 'https'
    const forwardedHost = req.headers.get('x-forwarded-host') || req.headers.get('host') || ''
    const origin = (process.env.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL.trim().length > 0)
      ? process.env.NEXT_PUBLIC_SITE_URL
      : `${forwardedProto}://${forwardedHost}`

    const formData = await req.formData()
    const itemsJson = formData.get('items') as string | null
    const rawSlug = String(formData.get('slug') || '')
    const slug = (() => {
      try {
        return extractSlugFromHref(decodeURIComponent(rawSlug)).trim()
      } catch {
        return extractSlugFromHref(rawSlug).trim()
      }
    })()
    const quantity = Math.max(1, Number(formData.get('quantity') || 1))

    // Load products from file system
    let list: Product[] = []
    try {
      const PRODUCTS_FILE_PATH = path.join(process.cwd(), 'data', 'products.json')
      if (existsSync(PRODUCTS_FILE_PATH)) {
        const data = await readFileAsync(PRODUCTS_FILE_PATH, 'utf-8')
        list = JSON.parse(data)
      }
    } catch (error) {
      console.error('Error loading products from file:', error)
    }

    const stripe = getStripeFromEnv()
    const opts = buildStripeRequestOptions()

    if (itemsJson) {
      let cart: { slug: string; quantity: number }[] = []
      try { cart = JSON.parse(itemsJson) } catch {}
      cart = cart.map(item => ({
        slug: String(item.slug || '').trim(),
        quantity: Math.max(1, Number(item.quantity || 1)),
      })).filter(item => item.slug.length > 0)
      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []

      for (const ci of cart) {
        const p = list.find(x => {
          const slugFromHref = x.href.split('/').pop()
          return slugFromHref === ci.slug
        })
        if (!p) continue
        const stripeProductId = p.stripeProductId
        if (stripeProductId) {
          try {
            const productObj = await stripe.products.retrieve(stripeProductId, opts)
            const defaultPrice = productObj.default_price
            if (!defaultPrice) {
              // Fallback to custom line item if no default price
              line_items.push({
                price_data: {
                  currency: 'brl',
                  product_data: { name: p.title },
                  unit_amount: Math.round(p.price * 100),
                },
                quantity: Math.max(1, Number(ci.quantity || 1)),
              })
            } else {
              const priceId = typeof defaultPrice === 'string' ? defaultPrice : defaultPrice.id
              line_items.push({ price: priceId, quantity: Math.max(1, Number(ci.quantity || 1)) })
            }
          } catch (error) {
            // If Stripe product doesn't exist, fallback to custom line item
            line_items.push({
              price_data: {
                currency: 'brl',
                product_data: { name: p.title },
                unit_amount: Math.round(p.price * 100),
              },
              quantity: Math.max(1, Number(ci.quantity || 1)),
            })
          }
        } else {
          // No Stripe product ID configured, create custom line item
          line_items.push({
            price_data: {
              currency: 'brl',
              product_data: { name: p.title },
              unit_amount: Math.round(p.price * 100),
            },
            quantity: Math.max(1, Number(ci.quantity || 1)),
          })
        }
      }

      if (line_items.length === 0) {
        return NextResponse.json({ error: 'No valid items in cart' }, { status: 400 })
      }

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items,
        success_url: `${origin}/checkout/success`,
        cancel_url: `${origin}/checkout/cancel`,
        metadata: {
          items: JSON.stringify(cart),
        },
        ...opts,
      })
      return NextResponse.redirect(session.url!, { status: 303 })
    }

    const product = list.find(p => extractSlugFromHref(p.href) === slug)
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

    const stripeProductId = product.stripeProductId

    if (stripeProductId) {
      try {
        const productObj = await stripe.products.retrieve(stripeProductId, opts)
        const defaultPrice = productObj.default_price
        if (!defaultPrice) {
          // Fallback to custom line item if no default price
          const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: [
              {
                price_data: {
                  currency: 'brl',
                  product_data: { name: product.title },
                  unit_amount: Math.round(product.price * 100),
                },
                quantity,
              },
            ],
            success_url: `${origin}/checkout/success`,
            cancel_url: `${origin}/checkout/cancel`,
            metadata: {
              items: JSON.stringify([{ slug, quantity }]),
            },
            ...opts,
          })
          return NextResponse.redirect(session.url!, { status: 303 })
        } else {
          const priceId = typeof defaultPrice === 'string' ? defaultPrice : defaultPrice.id
          const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: [{ price: priceId, quantity }],
            success_url: `${origin}/checkout/success`,
            cancel_url: `${origin}/checkout/cancel`,
            metadata: {
              items: JSON.stringify([{ slug, quantity }]),
            },
            ...opts,
          })
          return NextResponse.redirect(session.url!, { status: 303 })
        }
      } catch (error) {
        // If Stripe product doesn't exist, fallback to custom line item
        const session = await stripe.checkout.sessions.create({
          mode: 'payment',
          line_items: [
            {
              price_data: {
                currency: 'brl',
                product_data: { name: product.title },
                unit_amount: Math.round(product.price * 100),
              },
              quantity,
            },
          ],
          success_url: `${origin}/checkout/success`,
          cancel_url: `${origin}/checkout/cancel`,
          metadata: {
            items: JSON.stringify([{ slug, quantity }]),
          },
          ...opts,
        })
        return NextResponse.redirect(session.url!, { status: 303 })
      }
    } else {
      // No Stripe product ID configured, create custom line item
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'brl',
              product_data: { name: product.title },
              unit_amount: Math.round(product.price * 100),
            },
            quantity,
          },
        ],
        success_url: `${origin}/checkout/success`,
        cancel_url: `${origin}/checkout/cancel`,
        metadata: {
          items: JSON.stringify([{ slug, quantity }]),
        },
        ...opts,
      })
      return NextResponse.redirect(session.url!, { status: 303 })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Checkout failed' }, { status: 500 })
  }
}


