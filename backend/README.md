## Backend Setup
```bash
# Install dependencies
npm install

# Create database in terminal if incase you dont have db in terminal create db in pgadmin and configure it in the project
createdb budget_tracker 

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Start development server
npm run dev

# Run tests
npm test
```
