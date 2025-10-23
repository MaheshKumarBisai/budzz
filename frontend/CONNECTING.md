# Connecting Frontend to Backend

## Local Development

### 1. Start Backend

```bash
cd backend
npm run dev
```

Backend runs on `http://localhost:5000`

### 2. Configure Frontend

```bash
cd frontend
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:5000
```

### 3. Start Frontend

```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

## API Integration

The frontend uses Axios to communicate with the backend.

### Authentication Flow

```javascript
// 1. User logs in
const response = await axios.post('/api/auth/login', { email, password });
const { token } = response.data.data;

// 2. Store token
localStorage.setItem('token', token);

// 3. Add token to all requests
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

### API Service Structure

Located in `src/services/api.js`:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Auto-add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## Production Setup

### Backend (Render)

1. Deploy backend to Render
2. Note your backend URL: `https://your-app.onrender.com`

### Frontend (Vercel)

1. Set environment variable in Vercel:
   ```
   VITE_API_URL=https://your-app.onrender.com
   ```

2. Update CORS in backend:
   ```javascript
   app.use(cors({
     origin: 'https://your-frontend.vercel.app',
     credentials: true
   }));
   ```

## Testing the Connection

```bash
# 1. Health check
curl http://localhost:5000/health

# 2. Test from frontend
# Open browser console
fetch('http://localhost:5000/health')
  .then(r => r.json())
  .then(console.log)
```

## Common Issues

### CORS Error

**Problem**: `Access-Control-Allow-Origin` error

**Solution**: Update backend CORS config:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

### 401 Unauthorized

**Problem**: Token not being sent

**Solution**: Check localStorage has token:
```javascript
console.log(localStorage.getItem('token'));
```

### Network Error

**Problem**: Cannot connect to backend

**Solution**:
- Verify backend is running
- Check `VITE_API_URL` is correct
- Try direct curl to backend

## API Endpoints Reference

### Auth
- POST `/api/auth/signup`
- POST `/api/auth/login`
- POST `/api/auth/forgot`
- POST `/api/auth/reset`

### Transactions
- GET `/api/expenses`
- POST `/api/expenses`
- PUT `/api/expenses/:id`
- DELETE `/api/expenses/:id`

(Same for `/api/incomes`)

### Reports
- GET `/api/reports/monthly?month=10&year=2025`
- GET `/api/reports/comparison`
- GET `/api/reports/export?format=csv`

### Settings
- GET `/api/settings`
- PUT `/api/settings`

All protected routes require `Authorization: Bearer <token>` header.
