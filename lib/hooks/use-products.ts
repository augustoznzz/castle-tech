'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/lib/mock-data'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  const fetchProducts = async () => {
    if (typeof window === 'undefined') return
    
    try {
      setLoading(true)
      const response = await fetch('/api/products')
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      
      const data = await response.json()
      setProducts(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setIsClient(true)
    fetchProducts()
  }, [])

  // Listen for product updates from admin
  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return

    const handleProductUpdate = () => {
      fetchProducts()
    }

    // Listen for custom product update events
    window.addEventListener('ct_products_updated', handleProductUpdate)

    return () => {
      window.removeEventListener('ct_products_updated', handleProductUpdate)
    }
  }, [isClient])

  return { products, loading, error, refetch: fetchProducts }
}
