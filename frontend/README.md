# Smart Budget Tracker - Frontend

Modern React frontend for budget tracking with full backend integration.

## 🚀 Features

- ✅ JWT Authentication (Login/Signup)
- ✅ Dashboard with charts and summaries
- ✅ Transaction management (CRUD)
- ✅ Monthly reports & analytics
- ✅ Budget alerts and notifications
- ✅ Multi-currency support
- ✅ Dark/Light theme toggle
- ✅ Fully responsive design

## 📦 Tech Stack

- React 18
- Tailwind CSS
- Recharts (for charts)
- Axios (API calls)
- React Router v6
- Vite (build tool)

## 🛠️ Installation

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

## 🔌 Backend Connection

The frontend connects to your backend API. Make sure your backend is running on `http://localhost:5000` or update `VITE_API_URL` in `.env`.

### API Endpoints Used:
- `/api/auth/*` - Authentication
- `/api/users/me` - User profile
- `/api/expenses` - Expenses CRUD
- `/api/incomes` - Incomes CRUD
- `/api/reports/*` - Reports & analytics
- `/api/settings` - User settings

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Layout.jsx
│   │   └── TransactionCard.jsx
│   ├── contexts/         # React contexts
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── pages/            # Page components
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Transactions.jsx
│   │   ├── AddTransaction.jsx
│   │   ├── Reports.jsx
│   │   └── Settings.jsx
│   ├── services/         # API services
│   │   └── api.js
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run E2E tests
npm run test:e2e
```

## 🚀 Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` folder.

## 📚 Environment Variables

```
VITE_API_URL=http://localhost:5000
```

For production, set to your deployed backend URL (e.g., `https://your-backend.onrender.com`)

## 🎨 Theme

The app supports light/dark themes. Toggle in Settings page.

## 💱 Multi-Currency

Supports USD, EUR, GBP, INR, JPY. Configure in Settings.

## 📱 Responsive Design

Fully responsive for mobile, tablet, and desktop.

## 🔐 Authentication Flow

1. User signs up/logs in
2. JWT token stored in localStorage
3. Token sent with every API request
4. Auto-redirect to login on 401 errors

## 📊 Charts

- Pie chart for category breakdown
- Bar chart for monthly spending
- Line chart for trends (Reports page)

## 🔗 Connecting to Backend

Ensure your backend is running:
```bash
cd backend
npm run dev  # Backend on port 5000
```

Then start frontend:
```bash
cd frontend
npm run dev  # Frontend on port 3000
```

## 📝 License

MIT
