'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PRODUCTS, type Product } from '@/lib/mock-data'
import { formatPrice } from '@/lib/utils'
import { 
  getCartItems, 
  saveCartItems, 
  updateCartItemQuantity, 
  removeFromCart, 
  clearCart,
  type CartItem 
} from '@/lib/cart-utils'

export default function CartPage() {
  const router = useRouter()

  const [products, setProducts] = useState<Product[]>(PRODUCTS)
  const [cart, setCart] = useState<CartItem[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return
    
    try {
      const savedProducts = localStorage.getItem('ct_products')
      if (savedProducts) setProducts(JSON.parse(savedProducts))
    } catch (_) {}
  }, [isClient])

  useEffect(() => {
    if (!isClient) return

    // Load cart from session-based storage
    setCart(getCartItems())

    // Listen for cart updates from other components
    const handleCartUpdate = () => {
      setCart(getCartItems())
    }

    window.addEventListener('ct_cart_updated', handleCartUpdate)
    return () => {
      window.removeEventListener('ct_cart_updated', handleCartUpdate)
    }
  }, [isClient])

  const itemsDetailed = useMemo(() => {
    return cart
      .map((ci) => {
        const product = products.find((p) => p.href.split('/').pop() === ci.slug)
        if (!product) return null
        return { product, quantity: Math.max(1, ci.quantity) }
      })
      .filter(Boolean) as { product: Product; quantity: number }[]
  }, [cart, products])

  const subtotal = itemsDetailed.reduce((sum, it) => sum + it.product.price * it.quantity, 0)

  const updateCart = (next: CartItem[]) => {
    setCart(next)
    saveCartItems(next)
  }

  const setQty = (slug: string, q: number) => {
    updateCartItemQuantity(slug, q)
    // Update local state to reflect the change
    setCart(getCartItems())
  }

  const removeItem = (slug: string) => {
    removeFromCart(slug)
    // Update local state to reflect the change
    setCart(getCartItems())
  }

  const clearCartHandler = () => {
    clearCart()
    setCart([])
  }

  if (!isClient) {
    return (
      <div className="min-h-screen pt-20">
        <div className="container section-padding">
          <h1 className="heading-lg mb-6">Cart</h1>
          <div className="rounded-lg border border-border bg-border/10 p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-body">Loading cart...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container section-padding">
        <h1 className="heading-lg mb-6">Cart</h1>

        {itemsDetailed.length === 0 ? (
          <div className="rounded-lg border border-border bg-border/10 p-8 text-center">
            <p className="text-body mb-6">Your cart is empty.</p>
            <Link href="/plans" className="btn-primary">View plans</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {itemsDetailed.map(({ product, quantity }) => {
                const slug = product.href.split('/').pop() as string
                return (
                  <div key={slug} className="rounded-lg border border-border bg-border/10 p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-20 w-20 overflow-hidden rounded-md border border-border bg-transparent">
                        <Image src={product.image || '/images/castletech.svg'} alt={product.title} fill className="object-contain" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{product.title}</div>
                        <div className="text-sm text-muted">Unit price: {formatPrice(product.price)}</div>
                        <div className="mt-2 flex items-center gap-2">
                          <label className="text-sm text-muted">Qty</label>
                          <input
                            type="number"
                            min={1}
                            value={quantity}
                            onChange={(e) => setQty(slug, Number(e.target.value))}
                            className="w-24 rounded-md bg-border/20 border border-border px-3 py-2"
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold mb-2">{formatPrice(product.price * quantity)}</div>
                        <button onClick={() => removeItem(slug)} className="text-sm text-red-400 hover:text-red-300">Remove</button>
                      </div>
                    </div>
                  </div>
                )
              })}

              <div className="flex justify-between">
                <Link href="/plans" className="btn-secondary">Explore plans</Link>
                <button onClick={clearCartHandler} className="text-sm text-muted hover:text-foreground">Clear cart</button>
              </div>
            </div>

            <div>
              <div className="rounded-lg border border-border bg-border/10 p-4">
                <div className="mb-4 text-sm text-muted">Summary</div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="mb-4 flex items-center justify-between text-sm text-muted">
                  <span>Taxes</span>
                  <span>Included</span>
                </div>

                <div className="mb-4 h-px bg-border" />
                <div className="mb-6 flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <form action="/api/checkout" method="POST" className="space-y-2">
                  <input type="hidden" name="items" value={JSON.stringify(cart)} />
                  <button type="submit" className="btn-primary w-full">Checkout</button>
                </form>
                <div className="mt-3 text-center text-xs text-muted">
                  No account required! You will be redirected to Stripe to complete your purchase.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


