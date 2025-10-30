## Front-end Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your backend API URL

# 3. Start development server
npm run dev
```

The app will run on `http://localhost:3000`

## Backend Connection

The frontend connects to your backend API. Make sure your backend is running on `http://localhost:5000` or update `VITE_API_URL` in `.env`.

