'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Home, ShoppingCart, Info, Mail } from 'lucide-react'
import { NAVIGATION_ITEMS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), [])
  
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev)
  }, [])

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          'sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/95',
          isScrolled && 'shadow-sm'
        )}
      >
        <div className="container">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center space-x-2 font-bold text-xl hover:text-accent transition-colors duration-200"
              onClick={closeMobileMenu}
            >
              <span>CastleTech</span>
            </Link>

            {/* Desktop Navigation (no submenus) */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/"
                      className={cn(
                        'inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-[#22D3EE]',
                        pathname === '/' && 'text-[#22D3EE]'
                      )}
                    >
                      <Home className="mr-2 h-4 w-4" />
                      Home
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/plans"
                      className={cn(
                        'inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-[#22D3EE]',
                        pathname?.startsWith('/plans') && 'text-[#22D3EE]'
                      )}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Planos
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/about"
                      className={cn(
                        'inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-[#22D3EE]',
                        pathname === '/about' && 'text-[#22D3EE]'
                      )}
                    >
                      <Info className="mr-2 h-4 w-4" />
                      Sobre
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/contact"
                      className={cn(
                        'inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-[#22D3EE]',
                        pathname === '/contact' && 'text-[#22D3EE]'
                      )}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Contato
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <motion.button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 text-muted hover:text-foreground transition-colors duration-200 touch-manipulation"
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence mode="wait">
          {isMobileMenuOpen && (
            <motion.div
              initial={{ 
                opacity: 0, 
                y: -20,
                scale: 0.95
              }}
              animate={{ 
                opacity: 1, 
                y: 0,
                scale: 1
              }}
              exit={{ 
                opacity: 0, 
                y: -20,
                scale: 0.95
              }}
              transition={{ 
                duration: 0.3,
                ease: [0.4, 0.0, 0.2, 1],
                type: "tween"
              }}
              className="md:hidden border-t border-border/40 bg-background/98 backdrop-blur-sm will-change-transform"
              style={{ 
                transformOrigin: 'top center',
                backfaceVisibility: 'hidden'
              }}
            >
              <div className="container py-6">
                <nav className="flex flex-col space-y-6">
                  {NAVIGATION_ITEMS.map((item, index) => {
                    const isActive = pathname === item.href
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: index * 0.1,
                          duration: 0.2,
                          ease: "easeOut"
                        }}
                      >
                        <Link
                          href={item.href}
                          onClick={closeMobileMenu}
                          className={cn(
                            'block text-lg font-medium transition-all duration-200 py-2 px-1 rounded-md',
                            isActive 
                              ? 'text-[#22D3EE] bg-accent/10' 
                              : 'text-muted hover:text-foreground hover:bg-border/20'
                          )}
                        >
                          {item.name}
                        </Link>
                      </motion.div>
                    )
                  })}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  )
}
