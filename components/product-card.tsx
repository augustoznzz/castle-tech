'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/lib/mock-data'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Star, Tag, FileText, Download } from 'lucide-react'

interface ProductCardProps {
  product: Product
  index?: number
  hideImage?: boolean
}

export function ProductCard({ product, index = 0, hideImage = false }: ProductCardProps) {
  const [stock, setStock] = useState<string | null>(null)
  const [updatedProduct, setUpdatedProduct] = useState<Product>(product)
  const [isClient, setIsClient] = useState(false)
  const [hasHydrated, setHasHydrated] = useState(false)

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
    setHasHydrated(true)
  }, [])

  // Function to determine stock status from product data
  const determineStockStatus = (productData: Product) => {
    const hasStock = productData.stockMode === 'infinite' || 
                    productData.stockMode === 'none' || 
                    (productData.stockMode === 'keys' && (productData.stockKeys?.length || 0) > 0) ||
                    (productData.stockMode !== 'keys' && (productData.stockCount ?? 0) > 0)
    return hasStock ? 'available' : 'out'
  }

  // Function to update product data from localStorage
  const updateProductData = () => {
    if (!isClient || typeof window === 'undefined') return
    
    try {
      const saved = localStorage.getItem('ct_products')
      if (saved) {
        const list = JSON.parse(saved) as Product[]
        const found = list.find(p => p.id === product.id || p.href === product.href)
        if (found) {
          setUpdatedProduct(found)
          setStock(determineStockStatus(found))
        } else {
          // If product not found in localStorage, use original product
          setUpdatedProduct(product)
          setStock(determineStockStatus(product))
        }
      } else {
        setUpdatedProduct(product)
        setStock(determineStockStatus(product))
      }
    } catch (_) {
      setUpdatedProduct(product)
      setStock(determineStockStatus(product))
    }
  }

  // Process stock status immediately when product changes
  useEffect(() => {
    setUpdatedProduct(product)
    setStock(determineStockStatus(product))
  }, [product])

  useEffect(() => {
    if (isClient && hasHydrated) {
      updateProductData()
    }
  }, [product, isClient, hasHydrated])

  // Listen for product updates from admin
  useEffect(() => {
    if (!isClient || !hasHydrated || typeof window === 'undefined') return

    const handleProductUpdate = () => {
      updateProductData()
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ct_products') {
        updateProductData()
      }
    }

    window.addEventListener('ct_products_updated', handleProductUpdate)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('ct_products_updated', handleProductUpdate)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [product, isClient, hasHydrated])
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: 'easeOut'
      }}
      className="group"
    >
      <Link
        href={updatedProduct.href}
        className="block"
        aria-label={`View ${updatedProduct.title} product details`}
      >
        <div className="group relative overflow-hidden rounded-2xl bg-slate-950 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-emerald-500/10">
          <div className="absolute -left-16 -top-16 h-32 w-32 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/0 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-70" />
          <div className="absolute -right-16 -bottom-16 h-32 w-32 rounded-full bg-gradient-to-br from-teal-500/20 to-emerald-500/0 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-70" />

          {!hideImage && (
            <div className="relative p-6">
              <div className="relative h-48 w-full overflow-hidden rounded-xl bg-transparent">
                <Image
                  src={updatedProduct.image || '/images/castletech.svg'}
                  alt={updatedProduct.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            </div>
          )}

          {/* Product Info */}
          <div className="p-6">
            {/* Category */}
            {(updatedProduct.category || stock !== null) && (
              <div className="flex items-center gap-2 mb-2">
                {updatedProduct.category && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs text-muted">
                    <Tag className="h-3 w-3 text-muted" />
                    {updatedProduct.category}
                  </span>
                )}
                {stock !== null && (
                  <span className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs",
                    stock === 'available' 
                      ? "bg-green-500/20 text-green-400" 
                      : "bg-red-500/20 text-red-400"
                  )}>
                    {stock === 'available' ? 'Stock Available' : 'Out of Stock'}
                  </span>
                )}
              </div>
            )}
            
            <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors duration-200 mb-2 line-clamp-2">
              {updatedProduct.title}
            </h3>
            
            {/* Description */}
            {updatedProduct.description && (
              <p className="text-sm text-muted mb-3 line-clamp-2">
                {updatedProduct.description}
              </p>
            )}
            
            {/* Rating */}
            {updatedProduct.rating && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < Math.floor(updatedProduct.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted">
                  {updatedProduct.rating} ({updatedProduct.reviews?.toLocaleString()} reviews)
                </span>
              </div>
            )}
            
            {/* Price */}
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold text-accent">
                {formatPrice(updatedProduct.price)}
              </p>
              {updatedProduct.originalPrice && (
                <p className="text-sm text-muted line-through">
                  {formatPrice(updatedProduct.originalPrice)}
                </p>
              )}
            </div>

            {/* Quick action */}
            <div className="mt-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="inline-flex items-center justify-center rounded-lg border border-border bg-background/60 px-4 py-2 text-sm text-foreground shadow-sm backdrop-blur-md transition-colors hover:border-border-hover hover:bg-border/20">Quick view</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
