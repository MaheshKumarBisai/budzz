# Smart Budget & Expense Tracker - Backend API

Full-featured budget tracking API with Node.js, Express, and PostgreSQL.

## Features

✅ JWT Authentication
✅ Expense & Income Management
✅ Recurring Transactions
✅ Budget Alerts
✅ Multi-Currency Support
✅ Soft Delete
✅ Reports & Analytics

## Quick Start

```bash
# Install dependencies
npm install

# Create database
createdb budget_tracker

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Start development server
npm run dev

# Run tests
npm test
```

## API Endpoints

### Authentication
- POST /api/auth/signup
- POST /api/auth/login
- POST /api/auth/forgot
- POST /api/auth/reset

### Transactions
- POST /api/expenses (Create expense)
- GET /api/expenses (List expenses)
- PUT /api/expenses/:id (Update expense)
- DELETE /api/expenses/:id (Soft delete)

- POST /api/incomes (Create income)
- GET /api/incomes (List incomes)
- PUT /api/incomes/:id (Update income)
- DELETE /api/incomes/:id (Soft delete)

### Reports
- GET /api/reports/monthly
- GET /api/reports/comparison
- GET /api/reports/export

### Settings
- GET /api/settings
- PUT /api/settings

## Deployment

See DEPLOYMENT.md for Render + Neon deployment instructions.

## Documentation

- All endpoints require JWT in Authorization header (except auth routes)
- Soft delete preserves data with deleted_at timestamp
- Cron jobs run automatically:
  - Recurring transactions: Every hour
  - Budget alerts: Daily at midnight

## Tech Stack

- Node.js + Express.js
- PostgreSQL
- JWT + bcrypt
- Jest + Supertest
- node-cron

## License

MIT
