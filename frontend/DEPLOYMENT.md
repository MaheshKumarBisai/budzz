# Deployment Guide - Vercel

## Step 1: Build the Project

```bash
npm run build
```

This creates an optimized production build in `dist/`.

## Step 2: Deploy to Vercel

### Option A: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

### Option B: GitHub Integration (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables:
     ```
     VITE_API_URL=https://your-backend.onrender.com
     ```
6. Click "Deploy"

## Step 3: Configure Environment

In Vercel dashboard:
- Go to Settings → Environment Variables
- Add `VITE_API_URL` with your backend URL

## Step 4: Verify Deployment

1. Visit your deployed URL (e.g., `https://your-app.vercel.app`)
2. Test login/signup
3. Verify API connection

## Automatic Deployments

Vercel automatically deploys on every push to your main branch.

## Custom Domain (Optional)

1. Go to Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

## Troubleshooting

### CORS Errors

Make sure your backend allows your frontend domain:

```javascript
// backend/app.js
app.use(cors({
  origin: 'https://your-app.vercel.app',
  credentials: true
}));
```

### API Connection Failed

- Check `VITE_API_URL` environment variable
- Verify backend is deployed and accessible
- Check browser console for errors

### Build Fails

- Ensure all dependencies are in `package.json`
- Check Node version compatibility
- Review build logs in Vercel dashboard

## Production Checklist

- [ ] Backend deployed and accessible
- [ ] `VITE_API_URL` set correctly
- [ ] CORS configured in backend
- [ ] JWT secret is secure
- [ ] All environment variables set
- [ ] Test login/signup flow
- [ ] Verify all features work
- [ ] Check mobile responsiveness

## Monitoring

Vercel provides:
- Analytics
- Performance metrics
- Error tracking
- Build logs

Access via Vercel dashboard.
