const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection pool configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Expose pool globally to aid test teardown (Jest globalTeardown can close it)
try {
  global.__PG_POOL = pool;
} catch (err) {
  // ignore if global is not writable
}

// Connection events
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

// Query helper with logging
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'test') {
      console.log('Executed query', { text: text.substring(0, 50) + '...', duration, rows: res.rowCount });
    }
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Initialize database schema
const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        reset_token VARCHAR(255),
        reset_token_expiry TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );
    `);

    // User settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_settings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        currency VARCHAR(10) DEFAULT 'USD',
        budget_limit DECIMAL(12, 2) DEFAULT 0,
        theme VARCHAR(20) DEFAULT 'light',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Categories table
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(20) CHECK (type IN ('income', 'expense')) NOT NULL,
        icon VARCHAR(50),
        color VARCHAR(20),
        is_default BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Transactions table (for both expenses and incomes)
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        category_id INTEGER REFERENCES categories(id),
        type VARCHAR(20) CHECK (type IN ('income', 'expense')) NOT NULL,
        amount DECIMAL(12, 2) NOT NULL,
        description TEXT,
        payment_mode VARCHAR(50),
        transaction_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );
    `);

    // Recurring transactions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS recurring_transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        category_id INTEGER REFERENCES categories(id),
        type VARCHAR(20) CHECK (type IN ('income', 'expense')) NOT NULL,
        amount DECIMAL(12, 2) NOT NULL,
        description TEXT,
        payment_mode VARCHAR(50),
        frequency VARCHAR(20) CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly')) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE,
        next_run_date DATE NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Notifications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Check if default categories exist
    const categoryCheck = await client.query('SELECT COUNT(*) FROM categories WHERE is_default = true');

    if (parseInt(categoryCheck.rows[0].count) === 0) {
      // Insert default categories
      await client.query(`
        INSERT INTO categories (name, type, icon, color, is_default) VALUES
        ('Salary', 'income', '💰', '#4CAF50', true),
        ('Business', 'income', '💼', '#2196F3', true),
        ('Investment', 'income', '📈', '#FF9800', true),
        ('Food', 'expense', '🍔', '#F44336', true),
        ('Transport', 'expense', '🚗', '#9C27B0', true),
        ('Shopping', 'expense', '🛍️', '#E91E63', true),
        ('Bills', 'expense', '📄', '#607D8B', true),
        ('Health', 'expense', '🏥', '#00BCD4', true),
        ('Entertainment', 'expense', '🎬', '#FF5722', true),
        ('Other', 'expense', '📦', '#795548', true);
      `);
    }

    // Create indexes for better performance
    await client.query('CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_transactions_deleted ON transactions(deleted_at);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_recurring_next_run ON recurring_transactions(next_run_date);');

    await client.query('COMMIT');
    console.log('✅ Database schema initialized successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  query,
  initializeDatabase,
};
