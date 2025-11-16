# Expense Tracker API - Server

A RESTful API built with Express.js for managing personal expenses and income. This server provides authentication, category management, and transaction tracking functionality.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Models](#models)
- [Middleware](#middleware)
- [Controllers](#controllers)
- [Routes](#routes)

## Features

- User authentication (Register/Login/Logout)
- JWT-based authorization
- Category management (Create, Read, Update, Delete)
- Transaction management (Create, Read, Update, Delete)
- MongoDB database integration
- CORS enabled
- Input validation
- Secure password hashing

## Tech Stack

### Core Dependencies

- **express** (v5.1.0) - Fast, unopinionated web framework for Node.js
- **mongoose** (v8.19.3) - MongoDB object modeling tool
- **dotenv** (v17.2.3) - Loads environment variables from .env file
- **cors** (v2.8.5) - Enable Cross-Origin Resource Sharing
- **bcryptjs** - Password hashing library
- **jsonwebtoken** - JWT token generation and verification

### Dev Dependencies

- **nodemon** (v3.1.11) - Auto-restart server on file changes during development

## Project Structure

```
server/
├── controllers/          # Business logic
│   ├── authController.js
│   ├── categoryController.js
│   └── transactionController.js
├── models/              # Database schemas
│   ├── Users.js
│   ├── Categories.js
│   └── Transactions.js
├── routes/              # API route definitions
│   ├── authRoutes.js
│   ├── categoryRoutes.js
│   └── transactionRoutes.js
├── middleware/          # Custom middleware
│   └── auth.js
├── .env                 # Environment variables (not in git)
├── .env.example         # Example environment variables
├── .gitignore          # Git ignore rules
├── server.js           # Main application entry point
└── package.json        # Project dependencies and scripts
```

## Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd expense_tracker/server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install MongoDB** (if not already installed):
   - Download from [MongoDB Official Website](https://www.mongodb.com/try/download/community)
   - Or use MongoDB Atlas (cloud database)

4. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your actual values.

## Environment Variables

Create a `.env` file in the server root directory with the following variables:

```env
# MongoDB connection string
MONGODB_URI=mongodb://127.0.0.1:27017/expense-tracker

# JWT secret key for token generation (use a strong, random string)
JWT_SECRET=your_jwt_secret_key_here

# Server port
PORT=5000
```

**Important Security Notes:**
- Never commit `.env` file to version control
- Use a strong, unique JWT_SECRET in production
- For production, consider using MongoDB Atlas or another hosted solution

## Running the Server

### Development Mode (with auto-restart)
```bash
npm run dev
```
This uses nodemon to automatically restart the server when files change.

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in .env).

## API Endpoints

### Authentication Routes (`/api/auth`)
All auth routes are **public** (no token required).

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | `{ username, email, password }` |
| POST | `/api/auth/login` | Login user | `{ email, password }` |
| POST | `/api/auth/logout` | Logout user | None |

**Example - Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"password123"}'
```

**Example - Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Category Routes (`/api/categories`)
All category routes are **protected** (require authentication token).

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/api/categories` | Get all categories for user | None |
| POST | `/api/categories` | Create new category | `{ name, type, icon?, color? }` |
| GET | `/api/categories/:id` | Get category by ID | None |
| PUT | `/api/categories/:id` | Update category | `{ name?, type?, icon?, color? }` |
| DELETE | `/api/categories/:id` | Delete category | None |

**Example - Create Category:**
```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name":"Groceries","type":"expense","icon":"🛒","color":"#FF5733"}'
```

### Transaction Routes (`/api/transactions`)
All transaction routes are **protected** (require authentication token).

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/api/transactions` | Get all transactions for user | None |
| POST | `/api/transactions` | Create new transaction | `{ type, amount, category, description?, date }` |
| GET | `/api/transactions/:id` | Get transaction by ID | None |
| PUT | `/api/transactions/:id` | Update transaction | `{ type?, amount?, category?, description?, date? }` |
| DELETE | `/api/transactions/:id` | Delete transaction | None |

**Example - Create Transaction:**
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"type":"expense","amount":50.25,"category":"CATEGORY_ID","description":"Weekly groceries","date":"2025-11-15"}'
```

## Models

### User Model (`models/Users.js`)

**Schema:**
```javascript
{
  username: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  timestamps: true
}
```

**Methods:**
- `comparePassword(password)` - Compare plain password with hashed password

### Category Model (`models/Categories.js`)

**Schema:**
```javascript
{
  userId: ObjectId (ref: 'User', required),
  name: String (required, trimmed),
  type: String (enum: ['income', 'expense'], required),
  icon: String (optional),
  color: String (default: '#000000'),
  timestamps: true
}
```

**Indexes:**
- Unique compound index on `userId` and `name` (prevents duplicate category names per user)

### Transaction Model (`models/Transactions.js`)

**Schema:**
```javascript
{
  userId: ObjectId (ref: 'User', required),
  type: String (enum: ['income', 'expense'], required),
  amount: Number (required),
  category: ObjectId (ref: 'Categories', required),
  description: String (optional),
  date: Date (required),
  timestamps: true
}
```

## Middleware

### Authentication Middleware (`middleware/auth.js`)

**Purpose:** Verifies JWT tokens and protects routes from unauthorized access.

**Function:** `userAutorization(req, res, next)`

**How it works:**
1. Extracts token from `Authorization` header (format: `Bearer <token>`)
2. Verifies token using JWT_SECRET
3. Decodes user information and attaches to `req.user`
4. Calls `next()` to proceed to route handler
5. Returns 401 error if token is missing or invalid

**Usage in server.js:**
```javascript
// Applied globally after auth routes
app.use(authMiddleware);
```

This means all routes defined after this middleware require authentication.

**In your requests:**
Always include the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

## Controllers

### Auth Controller (`controllers/authController.js`)

**Functions:**

1. **register(req, res)**
   - Accepts: `{ username, email, password }`
   - Hashes password using bcryptjs
   - Creates new user in database
   - Returns success message

2. **login(req, res)**
   - Accepts: `{ email, password }`
   - Finds user by email
   - Compares password with hashed version
   - Generates JWT token (expires in 1 hour)
   - Returns token

3. **logout(req, res)**
   - JWT is stateless, so logout is handled client-side
   - Simply returns success message
   - Client should delete the stored token

### Category Controller (`controllers/categoryController.js`)

**Functions:**

1. **getAllCategories(req, res)**
   - Gets all categories for authenticated user
   - Uses `req.user.id` from auth middleware

2. **createCategory(req, res)**
   - Creates new category for authenticated user
   - Accepts: `{ name, type, icon?, color? }`
   - Associates with `userId` from token

3. **getCategoryById(req, res)**
   - Gets single category by ID
   - Verifies category belongs to authenticated user

4. **updateCategory(req, res)**
   - Updates category fields
   - Verifies ownership before updating

5. **deleteCategory(req, res)**
   - Deletes category
   - Verifies ownership before deleting

### Transaction Controller (`controllers/transactionController.js`)

**Functions:**

1. **getAllTransactions(req, res)**
   - Gets all transactions for authenticated user
   - Can be extended with filters (date range, type, category)

2. **createTransaction(req, res)**
   - Creates new transaction
   - Accepts: `{ type, amount, category, description?, date }`
   - Associates with `userId` from token

3. **getTransactionById(req, res)**
   - Gets single transaction by ID
   - Verifies transaction belongs to authenticated user

4. **updateTransaction(req, res)**
   - Updates transaction fields
   - Verifies ownership before updating

5. **deleteTransaction(req, res)**
   - Deletes transaction
   - Verifies ownership before deleting

## Routes

### Auth Routes (`routes/authRoutes.js`)

```javascript
const router = require('express').Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
```

**Base path:** `/api/auth`

### Category Routes (`routes/categoryRoutes.js`)

```javascript
const router = express.Router();

router.get('/', getAllCategories);
router.post('/', createCategory);
router.get('/:id', getCategoryById);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);
```

**Base path:** `/api/categories`
**Authentication:** Required (all routes)

### Transaction Routes (`routes/transactionRoutes.js`)

```javascript
const router = express.Router();

router.get('/', getAllTransactions);
router.post('/', createTransaction);
router.get('/:id', getTransactionById);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);
```

**Base path:** `/api/transactions`
**Authentication:** Required (all routes)

## Package Details

### express (v5.1.0)
- **Purpose:** Web framework for Node.js
- **Usage:** Handles HTTP requests, routing, middleware
- **Key features:** 
  - Fast and minimalist
  - Robust routing
  - Middleware support
  - HTTP utility methods

### mongoose (v8.19.3)
- **Purpose:** MongoDB object modeling for Node.js
- **Usage:** Database schema definitions, queries, validations
- **Key features:**
  - Schema-based modeling
  - Built-in validation
  - Middleware (hooks)
  - Query building
  - Population (joins)

### dotenv (v17.2.3)
- **Purpose:** Load environment variables from .env file
- **Usage:** `require('dotenv').config()`
- **Key features:**
  - Keeps secrets out of code
  - Different configs for different environments

### cors (v2.8.5)
- **Purpose:** Enable Cross-Origin Resource Sharing
- **Usage:** `app.use(cors())`
- **Key features:**
  - Allows frontend (different domain) to access API
  - Configurable origins, methods, headers

### bcryptjs
- **Purpose:** Password hashing library
- **Usage:** Hash passwords before storing, compare on login
- **Key features:**
  - Secure one-way hashing
  - Salt generation
  - Async operations

### jsonwebtoken
- **Purpose:** Create and verify JSON Web Tokens
- **Usage:** Generate tokens on login, verify on protected routes
- **Key features:**
  - Stateless authentication
  - Configurable expiration
  - Payload encryption

### nodemon (v3.1.11) - DevDependency
- **Purpose:** Auto-restart Node.js application on file changes
- **Usage:** `npm run dev`
- **Key features:**
  - Watches files for changes
  - Automatic restart
  - Configurable ignore patterns

## Development Workflow

1. **Start MongoDB** (if using local instance):
   ```bash
   mongod
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Test endpoints** using:
   - Postman
   - Thunder Client (VS Code extension)
   - curl commands
   - Your frontend application

4. **Monitor console** for:
   - Server startup confirmation
   - MongoDB connection status
   - Request logs
   - Error messages

## Common Issues & Solutions

### MongoDB Connection Failed
**Problem:** `MongoDB Error: connect ECONNREFUSED`
**Solution:** 
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env file
- Verify MongoDB is installed correctly

### JWT Token Invalid
**Problem:** `401 Invalid token`
**Solution:**
- Ensure token is included in Authorization header
- Format: `Bearer <token>`
- Check if token has expired (1 hour default)
- Verify JWT_SECRET matches between login and verification

### CORS Errors
**Problem:** Frontend cannot access API
**Solution:**
- Ensure `cors` middleware is enabled
- Configure specific origins if needed:
  ```javascript
  app.use(cors({
    origin: 'http://localhost:3000'
  }));
  ```

### Port Already in Use
**Problem:** `EADDRINUSE: address already in use`
**Solution:**
- Change PORT in .env file
- Or kill the process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```

## Testing the API

### Quick Test Flow

1. **Register a user:**
   ```bash
   POST /api/auth/register
   Body: { "username": "testuser", "email": "test@test.com", "password": "test123" }
   ```

2. **Login:**
   ```bash
   POST /api/auth/login
   Body: { "email": "test@test.com", "password": "test123" }
   Response: { "token": "..." }
   ```

3. **Create a category (use token from login):**
   ```bash
   POST /api/categories
   Headers: { "Authorization": "Bearer YOUR_TOKEN" }
   Body: { "name": "Food", "type": "expense", "color": "#FF5733" }
   ```

4. **Create a transaction (use token and category ID):**
   ```bash
   POST /api/transactions
   Headers: { "Authorization": "Bearer YOUR_TOKEN" }
   Body: { 
     "type": "expense", 
     "amount": 25.50, 
     "category": "CATEGORY_ID", 
     "description": "Lunch",
     "date": "2025-11-15"
   }
   ```

5. **Get all transactions:**
   ```bash
   GET /api/transactions
   Headers: { "Authorization": "Bearer YOUR_TOKEN" }
   ```

## Security Best Practices

- Always use HTTPS in production
- Keep JWT_SECRET strong and private
- Set appropriate token expiration times
- Validate and sanitize all user inputs
- Use environment variables for sensitive data
- Implement rate limiting for production
- Keep dependencies updated
- Use helmet.js for additional security headers

## Contributing

When contributing to this project:
1. Follow the existing code structure
2. Use meaningful commit messages
3. Test all changes thoroughly
4. Update documentation as needed
5. Follow JavaScript/Node.js best practices

## License

ISC

---

**Server Status:** `GET /` - Returns "Expense Tracker API is running"

For client-side integration, see the `/client` directory README.
