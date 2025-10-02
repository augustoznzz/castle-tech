export const NAVIGATION_ITEMS = [
  { name: 'Home', href: '/' },
  { name: 'Planos', href: '/plans' },
  { name: 'Sobre', href: '/about' },
  { name: 'Contato', href: '/contact' },
] as const

export const SOCIAL_LINKS = [
  { name: 'Twitter', href: '#', icon: 'twitter' },
  { name: 'Instagram', href: '#', icon: 'instagram' },
  { name: 'Facebook', href: '#', icon: 'facebook' },
  { name: 'LinkedIn', href: '#', icon: 'linkedin' },
] as const

export const FOOTER_LINKS = {
  plans: [
    { name: 'All Plans', href: '/plans' },
    { name: 'Starter', href: '/plans#starter' },
    { name: 'Pro', href: '/plans#pro' },
    { name: 'Premium', href: '/plans#premium' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Returns', href: '/returns' },
    { name: 'Size Guide', href: '/size-guide' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Accessibility', href: '/accessibility' },
  ],
} as const
