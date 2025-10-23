# Deployment Guide

## Render + Neon Deployment

### Step 1: Setup Neon PostgreSQL

1. Go to neon.tech and create account
2. Create new project
3. Copy connection string

### Step 2: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 3: Deploy to Render

1. Create Web Service on render.com
2. Connect GitHub repo
3. Configure:
   - Build: `npm install`
   - Start: `npm start`
4. Add environment variables:
   - DATABASE_URL
   - JWT_SECRET
   - NODE_ENV=production

### Step 4: Verify

```bash
curl https://your-app.onrender.com/health
```

## Environment Variables

Required:
- PORT=10000
- DATABASE_URL=(from Neon)
- JWT_SECRET=(generate random string)
- NODE_ENV=production

Optional:
- SMTP_HOST
- SMTP_PORT
- SMTP_USER
- SMTP_PASS
- FRONTEND_URL

## Post-Deployment

1. Test all endpoints with Postman
2. Check logs for errors
3. Monitor performance
4. Set up backups

See full deployment guide in documentation.
