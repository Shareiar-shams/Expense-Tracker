# Expense Tracker - Client Application

A modern, responsive React-based expense tracking application that helps users manage their income and expenses with beautiful visualizations and intuitive user interface.

![Expense Tracker](https://img.shields.io/badge/React-19.2.0-blue) ![Status](https://img.shields.io/badge/Status-Production%20Ready-green)

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure login/logout with JWT tokens
- **Transaction Management**: Add, edit, and delete income/expense transactions
- **Category Organization**: Manage income and expense categories
- **Dashboard Analytics**: Visual charts and summaries
- **Monthly Reports**: Track financial progress over time
- **User Profile**: Editable user information and settings
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Advanced Features
- **Real-time Charts**: Bar charts, doughnut charts, and line graphs
- **Monthly Filtering**: Filter transactions by specific months
- **Pagination**: Efficient handling of large transaction datasets
- **SweetAlert Integration**: Beautiful confirmation dialogs
- **Auto-redirect**: Automatic logout on token expiration
- **Data Validation**: Client-side and server-side validation

## 🛠 Technology Stack

- **Frontend Framework**: React 19.2.0
- **Routing**: React Router DOM 7.9.6
- **State Management**: React Context API
- **HTTP Client**: Axios 1.13.2
- **Charts**: Chart.js 4.5.1 & React-Chartjs-2 5.3.1
- **UI Alerts**: SweetAlert2 11.26.3
- **Icons**: React Icons 5.5.0
- **Styling**: Tailwind CSS 3.3.3
- **Build Tool**: Create React App

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or higher)
- npm or yarn package manager
- A running backend server (see server directory)

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# or using yarn
yarn install
```

### 2. Environment Configuration

Create a `.env` file in the client root directory:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=Expense Tracker
```

### 3. Start Development Server

```bash
npm start
# or
yarn start
```

The application will open at [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
npm run build
# or
yarn build
```

## 📁 Project Structure

```
client/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx       # Main navigation component
│   │   ├── ProtectedRoute.jsx # Route protection
│   │   └── PublicRoute.jsx   # Public route wrapper
│   ├── context/             # React Context providers
│   │   └── AuthContext.js   # Authentication context
│   ├── pages/               # Application pages
│   │   ├── Dashboard.jsx    # Main dashboard with charts
│   │   ├── TransactionPage.jsx # Transaction management
│   │   ├── CategoryPage.jsx     # Category management
│   │   ├── ProfilePage.jsx      # User profile settings
│   │   ├── SettingsPage.jsx     # Application settings
│   │   ├── LoginPage.jsx    # User login
│   │   ├── RegisterPage.jsx # User registration
│   │   ├── LandingPage.jsx  # Landing page
│   │   └── NotFound.jsx     # 404 page
│   ├── services/            # API services
│   │   └── api.js          # Axios configuration
│   ├── utils/              # Utility functions
│   ├── App.js              # Main application component
│   ├── index.js           # Application entry point
│   └── index.css          # Global styles
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
└── README.md            # This file
```

## 🎯 Key Pages & Features

### Dashboard (`/dashboard`)
- **Financial Summary**: Total income, expenses, and balance
- **Current Month Stats**: This month's financial breakdown
- **Visual Charts**: 
  - Income vs Expense bar chart
  - Financial distribution doughnut chart
  - Monthly trends line chart
- **Recent Transactions**: Paginated list of latest transactions
- **Monthly Breakdown**: Table showing monthly financial data

### Transactions (`/transactions`)
- **Add Transactions**: Form to add income/expense entries
- **Edit/Delete**: Modify or remove existing transactions
- **Filtering**: Filter by transaction type
- **Pagination**: Browse through large transaction lists
- **SweetAlert Confirmations**: Secure delete operations

### Categories (`/categories`)
- **Manage Categories**: Add, edit, delete income/expense categories
- **Color Coding**: Visual category identification
- **Type Organization**: Separate income and expense categories

### Profile (`/profile`)
- **User Information**: View account details
- **Username Editing**: Modify display name
- **Read-Only Fields**: Email and member since (for security)
- **Statistics**: Account activity summary

### Settings (`/settings`)
- **General Settings**: Currency, date format, language
- **Notifications**: Push notifications and email reports
- **Appearance**: Dark mode toggle
- **Data Management**: Clear all data option

### Authentication
- **Login/Register**: Secure user authentication
- **Password Reset**: Email-based password recovery
- **Auto-logout**: Automatic logout on token expiration
- **Route Protection**: Unauthorized access prevention

## 🎨 Design System

### Color Scheme
- **Primary Blue**: `#1d4ed8` (blue-700) - Main brand color
- **Success Green**: `#16a34a` (green-600) - Income indicators
- **Danger Red**: `#dc2626` (red-600) - Expense indicators
- **Neutral Gray**: `#6b7280` (gray-500) - Secondary text

### Components
- **Consistent Cards**: Rounded corners, shadows, and borders
- **Responsive Grid**: Mobile-first responsive design
- **Interactive Elements**: Hover effects and transitions
- **Form Controls**: Styled inputs, selects, and buttons

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `REACT_APP_APP_NAME` | Application display name | `Expense Tracker` |

### Tailwind CSS
The project uses Tailwind CSS for styling. Custom configurations are in `tailwind.config.js`.

### API Configuration
Axios is configured in `src/services/api.js` with:
- Base URL from environment variables
- Automatic JWT token injection
- Response interceptors for error handling

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full-featured layout with side navigation
- **Tablet**: Optimized grid layouts and touch-friendly controls
- **Mobile**: Collapsible navigation and stacked layouts

## 🚀 Available Scripts

```bash
# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build

# Eject (not recommended)
npm run eject
```

## 🔐 Authentication Flow

1. **Login**: User enters credentials → API validates → JWT token stored
2. **Protected Routes**: Token checked before page access
3. **Token Refresh**: Automatic validation every 5 minutes
4. **Auto-logout**: Redirect to login on token expiration
5. **Logout**: Clear token and user data

## 📊 Data Flow

### Transaction Management
1. Add/Edit → Form validation → API call → State update → UI refresh
2. Delete → Confirmation dialog → API call → Remove from state
3. Filter/Sort → Client-side processing → Updated display

### Dashboard Analytics
1. Data fetch → Aggregation calculations → Chart data generation
2. Monthly breakdown → Grouping by date → Summary calculations
3. Real-time updates → State changes → Automatic chart refresh

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## 🔧 Development Tips

### Adding New Pages
1. Create component in `src/pages/`
2. Add route in `src/App.js`
3. Update navigation in `src/components/Navbar.jsx` if needed
4. Add to ProtectedRoute if authentication required

### API Integration
1. Add new endpoints to `src/services/api.js`
2. Use existing auth headers and error handling
3. Follow the pattern used in existing components

### Styling Guidelines
1. Use Tailwind CSS classes
2. Follow the established color scheme
3. Maintain responsive design principles
4. Use consistent spacing and typography

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Setup
- Set `REACT_APP_API_URL` to your production API URL
- Ensure backend CORS is configured for your domain
- Test all functionality before deployment

### Static Hosting
The build creates a `build` folder with static files that can be deployed to:
- Vercel
- Netlify
- AWS S3
- Any static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the Expense Tracker application.

## 🆘 Troubleshooting

### Common Issues

**Build fails with memory error:**
```bash
NODE_OPTIONS="--max_old_space_size=4096" npm run build
```

**API calls failing:**
- Check backend server is running
- Verify `REACT_APP_API_URL` in `.env`
- Check browser console for CORS errors

**Charts not displaying:**
- Ensure Chart.js is properly installed
- Check for JavaScript errors in console
- Verify data format matches chart expectations

**Authentication issues:**
- Clear localStorage and try again
- Check token expiration
- Verify backend authentication endpoints

### Getting Help

1. Check browser console for errors
2. Verify API connectivity
3. Ensure all dependencies are installed
4. Check environment variables
5. Review component prop types

---

**Happy Expense Tracking! 📊💰**
