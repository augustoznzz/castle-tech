'use client'

import { useEffect, useState } from 'react'
import { clearCartOnSessionEnd, cleanupOldCarts } from '@/lib/cart-utils'

/**
 * SessionManager component handles session-based cart cleanup
 * This ensures cart data is properly isolated per user session
 */
export function SessionManager() {
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    // Clean up any old cart data from previous sessions
    cleanupOldCarts()

    // Set up cleanup when the page is about to unload
    const handleBeforeUnload = () => {
      // Note: We don't clear the cart on beforeunload because sessionStorage
      // automatically clears when the tab/window is closed
      // This is the desired behavior for session-based storage
    }

    // Set up cleanup when the page becomes hidden (tab switch, minimize, etc.)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Optional: Could add analytics or other cleanup here
      }
    }

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup function
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isClient])

  // This component doesn't render anything
  return null
}
