export interface Product {
  id: string
  title: string
  price: number
  image: string
  href: string
  badge?: string
  category?: string
  description?: string
  htmlDescription?: string
  originalPrice?: number
  rating?: number
  reviews?: number
  inventory?: 'in_stock' | 'low_stock' | 'out_of_stock'
  discountPercent?: number
  isNew?: boolean
  gallery?: string[]
  variants?: {
    colors?: string[]
    sizes?: string[]
    models?: string[]
  }
  specs?: Record<string, string>
  highlights?: string[]
  // Stock management
  stockMode?: 'infinite' | 'keys' | 'none'
  stockCount?: number
  stockKeys?: string[]
  // Payments
  stripeProductId?: string
  // Document management
  documents?: ProductDocument[]
}

export interface ProductDocument {
  id: string
  name: string
  filename: string
  originalName: string
  size: number
  type: string
  url: string
  uploadedAt: string
  description?: string
  isStock?: boolean // If true, this document is part of the product stock
}

export interface Testimonial {
  id: string
  name: string
  role: string
  quote: string
  avatar: string
}

export interface Feature {
  id: string
  title: string
  description: string
  icon: string
}

// Produtos padrão apenas como fallback para quando não há produtos criados ainda
export const PRODUCTS: Product[] = []

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Augusto Zuanazzi',
    role: 'Software Engineer',
    quote: 'The quality and design of these products exceeded my expectations. Fast shipping and excellent customer service.',
    avatar: 'https://media.discordapp.net/attachments/1393705889613221928/1421554022959026267/foto.png?ex=68d974da&is=68d8235a&hm=785ae9f39c14298548be7f4f7a7a6631fe8c54aa1dafbd5649ab509d8ea99028&=&format=webp&quality=lossless',
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Designer',
    quote: 'Beautiful, minimalist design that fits perfectly with my lifestyle. Highly recommended for anyone who values quality.',
    avatar: 'https://media.discordapp.net/attachments/1393705889613221928/1421554022959026267/foto.png?ex=68d974da&is=68d8235a&hm=785ae9f39c14298548be7f4f7a7a6631fe8c54aa1dafbd5649ab509d8ea99028&=&format=webp&quality=lossless',
  },
  {
    id: '3',
    name: 'James Rodriguez',
    role: 'Developer',
    quote: 'Outstanding build quality and attention to detail. These products are built to last and perform exceptionally well.',
    avatar: 'https://media.discordapp.net/attachments/1393705889613221928/1421554022959026267/foto.png?ex=68d974da&is=68d8235a&hm=785ae9f39c14298548be7f4f7a7a6631fe8c54aa1dafbd5649ab509d8ea99028&=&format=webp&quality=lossless',
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'Entrepreneur',
    quote: 'The customer experience is second to none. From browsing to delivery, everything is seamless and professional.',
    avatar: 'https://media.discordapp.net/attachments/1393705889613221928/1421554022959026267/foto.png?ex=68d974da&is=68d8235a&hm=785ae9f39c14298548be7f4f7a7a6631fe8c54aa1dafbd5649ab509d8ea99028&=&format=webp&quality=lossless',
  },
]

export const FEATURES: Feature[] = [
  {
    id: '1',
    title: 'Entrega Rápida',
    description: 'Frete grátis em pedidos acima de $100. Entrega expressa disponível para casos urgentes.',
    icon: 'truck',
  },
  {
    id: '2',
    title: 'Pagamento Seguro',
    description: 'Suas informações de pagamento são protegidas com criptografia de nível bancário.',
    icon: 'shield',
  },
  {
    id: '3',
    title: 'Suporte 24/7',
    description: 'Nossa equipe de suporte dedicada está disponível 24 horas por dia para ajudar você.',
    icon: 'headphones',
  },
]
