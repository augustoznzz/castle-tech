# Castle Tech

A premium SaaS built with Next.js 14, featuring a dark theme, smooth animations, and modern design inspired by minimalist aesthetics.

## ✨ Features

- **Modern Design**: Clean, minimalist interface with dark theme
- **Responsive**: Fully responsive design for all devices (360px → 1440px+)
- **Smooth Animations**: Framer Motion animations with reduced motion support
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Performance**: Optimized for fast load times with Next.js Image optimization
- **SEO Ready**: Complete metadata, Open Graph, and sitemap configuration
- **TypeScript**: Full type safety throughout the application

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: Radix UI Navigation Menu
- **Icons**: Lucide React
- **Fonts**: Inter (Google Fonts)

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles
│   ├── shop/              # Shop page
│   ├── about/             # About page
│   └── contact/           # Contact page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── hero.tsx          # Hero section
│   ├── product-grid.tsx  # Product showcase
│   ├── features-section.tsx # Benefits section
│   ├── testimonial-carousel.tsx # Customer testimonials
│   ├── newsletter-form.tsx # Newsletter signup
│   ├── site-header.tsx   # Navigation header
│   └── site-footer.tsx   # Footer component
├── lib/                  # Utility functions
│   ├── utils.ts         # Utility functions
│   ├── constants.ts     # App constants
│   └── mock-data.ts     # Sample data
├── public/              # Static assets
└── styles/              # Additional styles
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd castletech-commerce
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3001](http://localhost:3001)

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run type-check   # Run TypeScript checks

# Analysis
npm run build:analyze # Build with bundle analyzer
```

## 🌐 Deployment

### Netlify (Recommended)

This project is optimized for seamless deployment on Netlify:

1. **Connect your repository** to Netlify
2. **Build settings**:

   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18

3. **Environment variables** (optional):

   ```
   SITE_URL=https://your-domain.netlify.app
   ```

4. **Deploy**: Netlify will automatically deploy on every push to your main branch

### Manual Deployment

```bash
# Build the project
npm run build

# Start production server
npm run start
```

### Other Platforms

The project can also be deployed to:

- **Vercel**: Zero-config deployment
- **AWS Amplify**: Connect repository for auto-deployment
- **Railway**: Simple git-based deployment

## 🎨 Customization

### Colors

Update the color scheme in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      background: '#171717',    // Dark background
      foreground: '#F5F5F5',    // Primary text
      muted: '#A3A3A3',         // Secondary text
      accent: '#22D3EE',        // Accent color
      border: '#262626',        // Border color
    }
  }
}
```

### Content

- **Products**: Edit `lib/mock-data.ts` to update product information
- **Testimonials**: Modify testimonials in the same file
- **Navigation**: Update `lib/constants.ts` for menu items
- **Features**: Customize features in `components/features-section.tsx`

### Images

Replace placeholder images in the `public/images/` directory:

- `hero-product.jpg` - Hero section product image
- `products/` - Product images
- `avatars/` - Customer avatar images

## ♿ Accessibility Features

- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Management**: Visible focus indicators and logical tab order
- **Reduced Motion**: Respects `prefers-reduced-motion` setting
- **Color Contrast**: WCAG AA compliant color combinations
- **Skip Links**: Quick navigation to main content

## 🚀 Performance Optimizations

- **Image Optimization**: Next.js Image component with WebP/AVIF support
- **Code Splitting**: Automatic route-based code splitting
- **Bundle Analysis**: Built-in bundle analyzer for optimization
- **Caching**: Optimized cache headers for static assets
- **Compression**: Gzip compression enabled
- **Minification**: SWC minifier for smaller bundles

## 📱 Responsive Design

The site is fully responsive across all breakpoints:

- **Mobile**: 360px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px - 1440px
- **Large Desktop**: 1440px+

## 🔧 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📞 Support

For support or questions:
Discord: gutao#0001

---

Built with ❤️ by CastleTech
