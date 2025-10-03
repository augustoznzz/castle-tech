# Deployment Guide

This guide covers deploying Castle Tech to various platforms.

## 🚀 Netlify (Recommended)

### Automatic Deployment

1. **Connect Repository**

   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub/GitLab repository

2. **Build Settings**

   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18

3. **Environment Variables** (Optional)

   ```
   SITE_URL=https://your-site.netlify.app
   ```

4. **Deploy**
   - Netlify will automatically build and deploy
   - Future pushes to main branch trigger auto-deployment

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy to Netlify CLI
npx netlify-cli deploy --prod --dir=.next
```

## ⚡ Vercel

### Automatic Deployment

1. **Connect Repository**

   - Go to [Vercel](https://vercel.com)
   - Import your repository
   - Vercel auto-detects Next.js settings

2. **Deploy**
   - Automatic deployment on every push
   - Zero configuration required

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🌐 AWS Amplify

1. **Connect Repository**

   - Go to AWS Amplify Console
   - Connect your repository

2. **Build Settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - "**/*"
   ```

## 🚂 Railway

1. **Connect Repository**

   - Go to Railway
   - Connect your GitHub repository

2. **Auto-Deploy**
   - Railway detects Next.js automatically
   - Deploys on every push

## 📦 Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t castletech-commerce .
docker run -p 3001:3001 castletech-commerce
```

## 🔧 Environment Variables

### Required

- `SITE_URL`: Your site URL (for sitemap generation)

### Optional

- `NEXT_PUBLIC_GA_ID`: Google Analytics ID
- `NEWSLETTER_API_KEY`: Newsletter service API key
- `CONTACT_API_KEY`: Contact form service API key

## 📊 Performance Optimization

### Build Analysis

```bash
npm run build:analyze
```

### Bundle Size Optimization

- Images are automatically optimized with Next.js Image
- Code splitting is handled automatically
- Unused CSS is purged by Tailwind

### Caching

- Static assets cached for 1 year
- API responses cached appropriately
- CDN distribution via Netlify/Vercel

## 🚨 Troubleshooting

### Build Failures

1. **Node Version**: Ensure Node.js 18+
2. **Memory Issues**: Increase Node memory limit
   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" npm run build
   ```

### Deployment Issues

1. **Build Timeout**: Increase build timeout in platform settings
2. **Memory Limit**: Increase memory allocation
3. **Dependencies**: Ensure all dependencies are in `package.json`

### Performance Issues

1. **Bundle Size**: Use `npm run build:analyze` to identify large bundles
2. **Images**: Optimize images and use Next.js Image component
3. **Fonts**: Use `next/font` for optimal font loading

## 📈 Monitoring

### Analytics

- Google Analytics integration ready
- Performance monitoring via platform dashboards
- Error tracking available

### Health Checks

- `/api/health` endpoint for monitoring
- Uptime monitoring recommended
- Performance budgets configured

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run build
      - run: npm run lint
      - run: npm run type-check
```

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] Analytics tracking enabled
- [ ] Error monitoring set up
- [ ] Performance monitoring active
- [ ] SSL certificate configured
- [ ] CDN enabled
- [ ] Backup strategy in place
- [ ] Domain configured
- [ ] SEO metadata verified
- [ ] Accessibility testing completed
