'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PRODUCTS, type Product } from '@/lib/mock-data'
import { formatPrice } from '@/lib/utils'
import { ChevronLeft, Banknote } from 'lucide-react'
import { useProducts } from '@/lib/hooks/use-products'

export const dynamic = 'force-dynamic'

function CheckoutContent() {
  const router = useRouter()
  const search = useSearchParams()
  const slugFromUrl = search.get('slug') || ''
  const qtyFromUrl = Number(search.get('quantity') || 1)

  const { products: productsFromApi, loading: productsLoading } = useProducts()
  const [localProducts, setLocalProducts] = useState<Product[] | null>(null)
  const [quantity, setQuantity] = useState(Math.max(1, qtyFromUrl))
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Load any admin-edited products from localStorage to keep pricing/images in sync
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ct_products')
        if (saved) setLocalProducts(JSON.parse(saved))
      } catch (_) {}
    }
  }, [])

  const effectiveProducts: Product[] = useMemo(() => {
    if (productsFromApi && productsFromApi.length > 0) return productsFromApi
    if (localProducts && localProducts.length > 0) return localProducts
    return PRODUCTS
  }, [productsFromApi, localProducts])

  const extractSlugFromHref = (href: string): string => {
    if (!href) return ''
    if (href.includes('#')) return href.split('#').pop() || ''
    const tail = href.split('/').pop() || ''
    return tail
  }

  const normalizedSlug = useMemo(() => {
    try {
      const decoded = decodeURIComponent(slugFromUrl)
      return extractSlugFromHref(decoded).trim()
    } catch {
      return extractSlugFromHref(slugFromUrl).trim()
    }
  }, [slugFromUrl])

  const product = useMemo(() => {
    return effectiveProducts.find(p => extractSlugFromHref(p.href) === normalizedSlug)
  }, [effectiveProducts, normalizedSlug])

  const unitPrice = product?.price || 0
  const total = unitPrice * quantity

  const isLoadingProducts = productsLoading && (!localProducts || localProducts.length === 0) && (PRODUCTS.length === 0)

  return (
    <div className="min-h-screen pt-20">
      <div className="container section-padding">
        <button onClick={() => router.back()} className="mb-6 inline-flex items-center text-sm text-muted hover:text-foreground">
          <ChevronLeft className="mr-1 h-4 w-4" /> Back
        </button>

        <h1 className="heading-lg mb-6">Checkout</h1>

        {!product ? (
          isLoadingProducts ? (
            <div className="rounded-lg border border-border bg-border/10 p-6">
              <p className="text-body">Carregando produto...</p>
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-border/10 p-6">
              <p className="text-body">Product not found. Go back to the <Link href="/plans" className="text-[#22D3EE]">plans</Link>.</p>
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-lg border border-border bg-border/10 p-4">
                <div className="mb-4 text-sm text-muted">Order items</div>
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-md border border-border bg-transparent">
                    <Image src={product.image || '/images/castletech.svg'} alt={product.title} fill className="object-contain" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{product.title}</div>
                    <div className="text-sm text-muted">Unit price: {formatPrice(unitPrice)}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <label className="text-sm text-muted">Qty</label>
                      <input
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e)=>setQuantity(Math.max(1, Number(e.target.value)))}
                        className="w-24 rounded-md bg-border/20 border border-border px-3 py-2"
                      />
                    </div>
                  </div>
                  <div className="text-right font-semibold">{formatPrice(total)}</div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-border/10 p-4">
                <div className="mb-2 text-sm text-muted">Guest Checkout</div>
                <p className="text-sm text-muted">Sem necessidade de conta! Pagamentos são processados via Pix. Você receberá o comprovante por e-mail após a compra.</p>
              </div>
            </div>

            <div>
              <div className="rounded-lg border border-border bg-border/10 p-4">
                <div className="mb-4 text-sm text-muted">Summary</div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="mb-4 flex items-center justify-between text-sm text-muted">
                  <span>Taxes</span>
                  <span>Included</span>
                </div>

                <div className="mb-4 h-px bg-border" />
                <div className="mb-6 flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>

                {/* Pagamento via Pix */}
                <button
                  onClick={async () => {
                    // Basic Pix call: create/order context could be derived from slug/qty/total
                    try {
                      const res = await fetch('/api/pix', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ orderId: `${normalizedSlug || 'order'}-${Date.now()}`, amount: Math.round(total * 100) }),
                      })
                      if (!res.ok) throw new Error('Falha ao iniciar pagamento Pix')
                      const data = await res.json()
                      if (data.checkoutUrl) {
                        window.location.href = data.checkoutUrl
                        return
                      }
                      if (data.pixCode) {
                        // Redirect to an internal Pix page that renders QR and copy code
                        const params = new URLSearchParams({ code: data.pixCode })
                        window.location.href = `/checkout/pix?${params.toString()}`
                        return
                      }
                      throw new Error('Resposta Pix inválida')
                    } catch (e) {
                      alert((e as Error).message || 'Erro no pagamento Pix')
                    }
                  }}
                  className="w-full mt-1 flex items-center justify-center gap-2 rounded-lg border border-transparent px-6 py-3 text-black bg-gradient-to-r from-green-300 via-green-400 to-green-500 hover:opacity-95 font-medium transition-all duration-200 hover:scale-105 focus:scale-105"
                >
                  <Banknote className="w-4 h-4 text-black" />
                  <span>Pix</span>
                </button>

                {/* Removido pagamento por cartão (Stripe) */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="container pt-24 pb-24">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}


