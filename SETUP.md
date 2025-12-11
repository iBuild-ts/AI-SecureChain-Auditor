# SecureChain Auditor™ - Complete Setup Guide

## Quick Start (5 minutes)

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your MongoDB URI
# MONGODB_URI=mongodb://localhost:27017/securechain-auditor
# JWT_SECRET=your_super_secret_key_change_in_production

# Start backend server
npm run dev
```

**Backend runs on:** `http://localhost:5000`

### 2. Frontend Setup (in a new terminal)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
```

**Frontend runs on:** `http://localhost:3000`

## Full Setup Instructions

### Prerequisites

- **Node.js** v16 or higher ([Download](https://nodejs.org/))
- **MongoDB** (Local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **npm** or **yarn** package manager
- **Git** (optional, for version control)

### Step 1: MongoDB Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB Community Edition
# macOS (using Homebrew):
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify connection
mongosh
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Update `.env` with your connection string

### Step 2: Backend Configuration

```bash
cd backend

# Install all dependencies
npm install

# Create environment file
cp .env.example .env
```

**Edit `.env`:**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/securechain-auditor
JWT_SECRET=your_jwt_secret_key_change_in_production_12345
NODE_ENV=development
```

**Start the server:**
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### Step 3: Frontend Configuration

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The app will automatically open in your browser at `http://localhost:3000`

## Testing the Application

### 1. Create an Account
- Go to `http://localhost:3000/register`
- Fill in name, email, and password
- Click "Sign Up"

### 2. Test the Dashboard
- You'll be redirected to the dashboard
- See your user profile and stats

### 3. Create Your First Audit
- Click "New Audit" button
- Enter a contract name (e.g., "MyToken")
- Select a blockchain (Ethereum, Polygon, etc.)
- Paste sample Solidity code:

```solidity
pragma solidity ^0.8.0;

contract VulnerableContract {
    mapping(address => uint256) public balances;
    
    // Reentrancy vulnerability
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount);
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success);
        balances[msg.sender] -= amount;
    }
    
    // Integer overflow vulnerability
    function transfer(uint256 amount) public {
        balances[msg.sender] += amount;
    }
}
```

- Click "Start Audit"
- View the detected vulnerabilities
- See the clean code suggestions
- Generate a PDF report

## Project Structure

```
SecureChainAuditor/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Audit.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── audits.js
│   │   ├── reports.js
│   │   └── user.js
│   ├── services/
│   │   ├── vulnerabilityDetector.js
│   │   └── reportGenerator.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── AuditDetail.js
│   │   │   ├── Pricing.js
│   │   │   └── *.css
│   │   ├── components/
│   │   │   ├── Navigation.js
│   │   │   └── Navigation.css
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│   └── public/
│
└── README.md
```

## API Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Audit
```bash
curl -X POST http://localhost:5000/api/audits/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "contractName": "MyToken",
    "contractCode": "pragma solidity ^0.8.0; ...",
    "chain": "ethereum"
  }'
```

## Troubleshooting

### MongoDB Connection Error
**Problem:** `MongooseError: Cannot connect to MongoDB`

**Solution:**
1. Verify MongoDB is running: `brew services list` (macOS)
2. Check connection string in `.env`
3. If using Atlas, whitelist your IP address
4. Verify database exists

### Port Already in Use
**Problem:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### CORS Errors
**Problem:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
- Backend CORS is configured in `server.js`
- Ensure frontend is running on `http://localhost:3000`
- Check that API calls use correct URL

### Module Not Found
**Problem:** `Cannot find module 'express'`

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Environment Variables Reference

### Backend (.env)
```
PORT                 - Server port (default: 5000)
MONGODB_URI         - MongoDB connection string
JWT_SECRET          - Secret key for JWT tokens
NODE_ENV            - Environment (development/production)
```

### Frontend (.env)
```
REACT_APP_API_URL   - Backend API URL (default: http://localhost:5000)
```

## Performance Tips

1. **Database Indexing**: Add indexes to frequently queried fields
2. **Caching**: Implement Redis for audit results
3. **Code Splitting**: React lazy loading for routes
4. **Image Optimization**: Compress assets
5. **API Rate Limiting**: Implement rate limiting on backend

## Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Use HTTPS in production
- [ ] Enable MongoDB authentication
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Enable CORS only for trusted domains
- [ ] Use environment variables for secrets
- [ ] Implement logging and monitoring
- [ ] Regular security audits
- [ ] Keep dependencies updated

## Deployment

### Deploy Backend (Heroku)
```bash
# Install Heroku CLI
brew tap heroku/brew && brew install heroku

# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set MONGODB_URI=your_mongodb_uri

# Deploy
git push heroku main
```

### Deploy Frontend (Netlify)
```bash
# Build the app
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=build
```

## Next Steps

1. **Customize Vulnerability Patterns**: Edit `backend/services/vulnerabilityDetector.js`
2. **Add More Chains**: Update chain options in `frontend/src/pages/Dashboard.js`
3. **Implement Payment**: Integrate Stripe for subscription management
4. **Add Email Notifications**: Integrate SendGrid or Mailgun
5. **Advanced Analytics**: Add charts and metrics dashboard
6. **API Documentation**: Generate with Swagger/OpenAPI

## Support & Resources

- **Documentation**: See README.md
- **Issues**: Check GitHub issues
- **Community**: Join our Discord server
- **Email**: support@securechainauditor.com

---

**Happy auditing! 🔐**
