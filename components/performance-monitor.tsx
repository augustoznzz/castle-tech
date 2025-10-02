'use client'

import { useEffect } from 'react'

export function PerformanceMonitor() {
  useEffect(() => {
    // Web Vitals monitoring
    if (typeof window !== 'undefined' && 'performance' in window) {
      // LCP (Largest Contentful Paint)
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime)
            // Send to analytics service
            if (typeof (window as any).gtag !== 'undefined') {
              (window as any).gtag('event', 'web_vitals', {
                name: 'LCP',
                value: Math.round(entry.startTime),
                event_category: 'Web Vitals',
              })
            }
          }
        }
      })
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] })

      // CLS (Cumulative Layout Shift)
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        }
        console.log('CLS:', clsValue)
        if (typeof (window as any).gtag !== 'undefined') {
          (window as any).gtag('event', 'web_vitals', {
            name: 'CLS',
            value: Math.round(clsValue * 1000),
            event_category: 'Web Vitals',
          })
        }
      })
      
      clsObserver.observe({ entryTypes: ['layout-shift'] })

      // FID (First Input Delay) - approximated with click events
      let firstInput = true
      const measureFID = (event: Event) => {
        if (firstInput) {
          firstInput = false
          const fid = performance.now() - (event as any).timeStamp
          console.log('FID (approximated):', fid)
          if (typeof (window as any).gtag !== 'undefined') {
            (window as any).gtag('event', 'web_vitals', {
              name: 'FID',
              value: Math.round(fid),
              event_category: 'Web Vitals',
            })
          }
        }
      }

      document.addEventListener('click', measureFID, { once: true })
      document.addEventListener('keydown', measureFID, { once: true })

      // Cleanup
      return () => {
        observer.disconnect()
        clsObserver.disconnect()
        document.removeEventListener('click', measureFID)
        document.removeEventListener('keydown', measureFID)
      }
    }
  }, [])

  return null
}
