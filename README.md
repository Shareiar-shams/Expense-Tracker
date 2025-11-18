# Expense Tracker Application

A modern, full-stack expense tracking application built with React and Node.js, featuring comprehensive financial management capabilities with beautiful visualizations and user-friendly interface.

![React](https://img.shields.io/badge/React-19.2.0-blue) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![MongoDB](https://img.shields.io/badge/MongoDB-6+-green) ![JWT](https://img.shields.io/badge/JWT-Authentication-orange)

## 🌟 Project Overview

Expense Tracker is a complete financial management solution that helps individuals and businesses track income and expenses with real-time analytics, visual reporting, and comprehensive user management. The application provides a seamless experience from transaction entry to detailed financial insights.

## 🏗 Architecture

```
┌─────────────────┐    HTTP/JSON    ┌─────────────────┐
│   Client App    │ ◄────────────► │  Server API     │
│   (React.js)    │                │   (Node.js)     │
│                 │                │                 │
│ • Dashboard     │                │ • REST API      │
│ • Transactions  │                │ • JWT Auth      │
│ • Categories    │                │ • MongoDB       │
│ • Profile       │                │ • Validation    │
│ • Settings      │                │ • Data Processing│
└─────────────────┘                └─────────────────┘
```

## 🎯 Key Features

### 💰 Financial Management
- **Transaction Tracking**: Add, edit, delete income and expense transactions
- **Category Management**: Organize transactions with custom categories
- **Monthly Analytics**: Track financial progress over time
- **Budget Monitoring**: Visual insights into spending patterns
- **Real-time Calculations**: Automatic balance and summary updates

### 📊 Visual Analytics
- **Interactive Charts**: Bar charts, doughnut charts, and line graphs
- **Monthly Trends**: Track financial patterns over time
- **Dashboard Widgets**: Comprehensive financial overview
- **Export Capabilities**: Data visualization and reporting

### 👤 User Experience
- **Secure Authentication**: JWT-based login/logout system
- **User Profiles**: Customizable user information
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Auto-logout**: Automatic session management on token expiration
- **SweetAlert Integration**: Beautiful confirmation dialogs

### 🔒 Security & Reliability
- **JWT Authentication**: Secure token-based authentication
- **Password Security**: Bcrypt hashing for password storage
- **Input Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error management
- **Auto-redirect**: Seamless navigation on authentication issues

## 🛠 Technology Stack

### Frontend (Client)
- **React 19.2.0**: Modern UI framework with hooks
- **React Router DOM 7.9.6**: Client-side routing
- **Chart.js 4.5.1**: Data visualization library
- **React-Chartjs-2 5.3.1**: React wrapper for charts
- **Axios 1.13.2**: HTTP client for API calls
- **SweetAlert2 11.26.3**: Beautiful alert dialogs
- **Tailwind CSS 3.3.3**: Utility-first CSS framework
- **React Icons 5.5.0**: Icon library

### Backend (Server)
- **Node.js 18+**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB 6+**: NoSQL database with Mongoose
- **JWT (jsonwebtoken)**: Authentication tokens
- **Bcrypt**: Password hashing library
- **CORS**: Cross-origin resource sharing
- **Express Validator**: Input validation middleware
- **Helmet**: Security middleware

## 📁 Project Structure

```
expense_tracker/
├── client/                 # React frontend application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── context/       # React context providers
│   │   ├── services/      # API service layer
│   │   └── utils/         # Utility functions
│   ├── package.json       # Frontend dependencies
│   └── README.md          # Frontend documentation
│
├── server/                # Node.js backend application
│   ├── controllers/       # Route handlers
│   ├── middleware/        # Custom middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── server.js         # Application entry point
│   ├── package.json      # Backend dependencies
│   └── README.md         # Backend documentation
│
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- MongoDB (local or cloud instance)
- npm or yarn package manager

### 1. Clone Repository
```bash
git clone <repository-url>
cd expense_tracker
```

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Configure your MongoDB connection in .env
npm start
```
Server will run on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd ../client
npm install
cp .env.example .env
# Configure API URL in .env
npm start
```
Client will run on `http://localhost:3000`

### 4. Environment Configuration

**Server (.env)**:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense_tracker
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=1h
SMTP_HOST=your_email_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_email_password
```

**Client (.env)**:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=Expense Tracker
```

## 📊 Application Pages

### Frontend Pages
| Page | Path | Description |
|------|------|-------------|
| **Landing** | `/` | Public landing page |
| **Login** | `/login` | User authentication |
| **Register** | `/register` | User registration |
| **Dashboard** | `/dashboard` | Financial overview with charts |
| **Transactions** | `/transactions` | Transaction management with pagination |
| **Categories** | `/categories` | Category management |
| **Profile** | `/profile` | User profile settings |
| **Settings** | `/settings` | Application preferences |
| **Not Found** | `*` | 404 error page |

### Backend API Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | User registration | ❌ |
| POST | `/api/auth/login` | User login | ❌ |
| GET | `/api/auth/verify` | Token verification | ✅ |
| GET | `/api/transactions` | Get all transactions | ✅ |
| POST | `/api/transactions` | Create transaction | ✅ |
| PUT | `/api/transactions/:id` | Update transaction | ✅ |
| DELETE | `/api/transactions/:id` | Delete transaction | ✅ |
| GET | `/api/categories` | Get all categories | ✅ |
| POST | `/api/categories` | Create category | ✅ |
| PUT | `/api/categories/:id` | Update category | ✅ |
| DELETE | `/api/categories/:id` | Delete category | ✅ |

## 🎨 UI/UX Features

### Dashboard Analytics
- **Financial Summary**: Total income, expenses, and net balance
- **Current Month Stats**: This month's financial breakdown
- **Visual Charts**: 
  - Income vs Expense comparison
  - Financial distribution
  - Monthly trends over time
- **Recent Transactions**: Paginated list with filtering
- **Monthly Breakdown**: Detailed monthly financial table

### Transaction Management
- **Add Transactions**: Easy-to-use form with validation
- **Edit/Delete**: Full CRUD operations with SweetAlert confirmations
- **Filtering**: Filter by transaction type and month
- **Pagination**: Efficient handling of large datasets
- **Search**: Quick transaction lookup

### User Experience
- **Responsive Design**: Mobile-first approach
- **Loading States**: Visual feedback during operations
- **Error Handling**: User-friendly error messages
- **Auto-save**: Graceful data persistence
- **Keyboard Navigation**: Accessibility support

## 🔐 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure session management
- **Password Hashing**: Bcrypt encryption
- **Token Expiration**: Automatic session timeout
- **Route Protection**: Protected and public routes
- **Auto-redirect**: Seamless navigation on auth issues

### Data Security
- **Input Validation**: Server-side validation
- **SQL Injection Protection**: MongoDB security
- **XSS Protection**: Input sanitization
- **CORS Configuration**: Cross-origin security
- **Environment Variables**: Secure configuration

## 📱 Mobile Support

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience
- **Tablet**: Touch-optimized interface
- **Mobile**: Streamlined mobile experience
- **PWA Ready**: Progressive Web App capabilities

## 🚀 Deployment

### Production Build
```bash
# Backend
cd server
npm run build

# Frontend
cd ../client
npm run build
```

### Environment Setup
1. Set up MongoDB Atlas or self-hosted MongoDB
2. Configure environment variables
3. Set up SSL certificates
4. Configure reverse proxy (Nginx/Apache)

### Deployment Platforms
- **Frontend**: Vercel, Netlify, AWS S3
- **Backend**: Heroku, AWS EC2, DigitalOcean
- **Database**: MongoDB Atlas, self-hosted MongoDB

## 🧪 Testing

```bash
# Frontend tests
cd client
npm test

# Backend tests
cd server
npm test
```

## 📈 Performance Features

- **Lazy Loading**: Component-based code splitting
- **Data Pagination**: Efficient large dataset handling
- **Memoization**: React performance optimization
- **Caching**: Browser and API response caching
- **Compression**: Gzip compression for static assets

## 🔮 Future Enhancements

### Planned Features
- **Data Export**: CSV/Excel export functionality
- **Advanced Analytics**: Spending categorization and insights
- **Budget Goals**: Set and track budget targets
- **Receipt Upload**: Image receipt processing
- **Multi-currency**: Support for multiple currencies
- **Dark Mode**: Theme switching capability
- **Notifications**: Push notification system
- **API Integration**: Bank account synchronization

### Technical Improvements
- **TypeScript Migration**: Enhanced type safety
- **Testing Suite**: Comprehensive test coverage
- **Microservices**: Service architecture migration
- **Real-time Updates**: WebSocket integration
- **Offline Support**: PWA with offline capabilities

## 📊 Sample Data Flow

```
User Input → Form Validation → API Call → Database → Response → UI Update
     ↓             ↓            ↓          ↓          ↓          ↓
Transaction → Client Validation → Axios → MongoDB → JSON → React State
    Form      →   Error Check   → POST   → Insert → 200  → Dashboard Update
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the documentation in individual package README files
- Review existing issues in the repository
- Create new issues for bugs or feature requests

## 🎉 Acknowledgments

- **Chart.js**: Excellent charting library
- **Tailwind CSS**: Utility-first CSS framework
- **React**: Powerful UI framework
- **Express.js**: Minimal web framework
- **MongoDB**: Flexible NoSQL database
- **Community**: Open source contributors

---

**Built with ❤️ for better financial management** 💰📊

*Start tracking your expenses today and take control of your financial future!*