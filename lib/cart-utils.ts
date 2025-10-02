/**
 * Cart utilities for managing user-specific cart storage
 * This ensures cart data is isolated per user session
 */

export type CartItem = {
  slug: string
  quantity: number
}

// Generate a unique session ID for this user session
function getSessionId(): string {
  // Only run on client side
  if (typeof window === 'undefined') return ''
  
  // Check if we already have a session ID in sessionStorage
  let sessionId = sessionStorage.getItem('ct_session_id')
  
  if (!sessionId) {
    // Generate a new session ID using timestamp and random string
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('ct_session_id', sessionId)
  }
  
  return sessionId
}

// Get the cart storage key for the current session
function getCartKey(): string {
  const sessionId = getSessionId()
  return `ct_cart_${sessionId}`
}

// Get cart items for the current session
export function getCartItems(): CartItem[] {
  // Only run on client side
  if (typeof window === 'undefined') return []
  
  try {
    const cartKey = getCartKey()
    const raw = sessionStorage.getItem(cartKey)
    return raw ? JSON.parse(raw) : []
  } catch (_) {
    return []
  }
}

// Save cart items for the current session
export function saveCartItems(items: CartItem[]): void {
  // Only run on client side
  if (typeof window === 'undefined') return
  
  try {
    const cartKey = getCartKey()
    sessionStorage.setItem(cartKey, JSON.stringify(items))
    // Dispatch custom event to notify components of cart update
    window.dispatchEvent(new Event('ct_cart_updated'))
  } catch (_) {
    // Silently fail if sessionStorage is not available
  }
}

// Add item to cart
export function addToCart(slug: string, quantity: number): void {
  const items = getCartItems()
  const existingIndex = items.findIndex(item => item.slug === slug)
  
  if (existingIndex >= 0) {
    items[existingIndex].quantity = Math.max(1, (items[existingIndex].quantity || 1) + quantity)
  } else {
    items.push({ slug, quantity: Math.max(1, quantity) })
  }
  
  saveCartItems(items)
}

// Update item quantity in cart
export function updateCartItemQuantity(slug: string, quantity: number): void {
  const items = getCartItems()
  const updatedItems = items.map(item => 
    item.slug === slug 
      ? { ...item, quantity: Math.max(1, quantity) }
      : item
  )
  saveCartItems(updatedItems)
}

// Remove item from cart
export function removeFromCart(slug: string): void {
  const items = getCartItems()
  const filteredItems = items.filter(item => item.slug !== slug)
  saveCartItems(filteredItems)
}

// Clear entire cart
export function clearCart(): void {
  saveCartItems([])
}

// Get total item count in cart
export function getCartItemCount(): number {
  // Only run on client side
  if (typeof window === 'undefined') return 0
  
  const items = getCartItems()
  return items.reduce((sum, item) => sum + Math.max(1, Number(item.quantity || 0)), 0)
}

// Clean up old cart data (optional maintenance function)
export function cleanupOldCarts(): void {
  // Only run on client side
  if (typeof window === 'undefined') return
  
  try {
    const keys = Object.keys(sessionStorage)
    const oldCartKeys = keys.filter(key => key.startsWith('ct_cart_') && key !== getCartKey())
    
    oldCartKeys.forEach(key => {
      sessionStorage.removeItem(key)
    })
  } catch (_) {
    // Silently fail if sessionStorage is not available
  }
}

// Clear cart when session ends (call this on page unload)
export function clearCartOnSessionEnd(): void {
  // Only run on client side
  if (typeof window === 'undefined') return
  
  try {
    const cartKey = getCartKey()
    sessionStorage.removeItem(cartKey)
    sessionStorage.removeItem('ct_session_id')
  } catch (_) {
    // Silently fail if sessionStorage is not available
  }
}

