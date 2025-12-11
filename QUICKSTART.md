# SecureChain Auditor™ - Quick Start Guide

Get up and running in 5 minutes! 🚀

## Prerequisites

- Node.js v16+ ([Download](https://nodejs.org/))
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- Git (optional)

## 1️⃣ Clone/Navigate to Project

```bash
cd /Users/horlahdefi/CascadeProjects/SecureChainAuditor
```

## 2️⃣ Start Backend

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and add MongoDB URI
# MONGODB_URI=mongodb://localhost:27017/securechain-auditor

# Start server
npm run dev
```

✅ Backend running on `http://localhost:5000`

## 3️⃣ Start Frontend (New Terminal)

```bash
cd frontend

# Install dependencies
npm install

# Start React app
npm start
```

✅ Frontend running on `http://localhost:3000`

## 4️⃣ Test the Application

### Create Account
1. Go to `http://localhost:3000/register`
2. Sign up with email and password
3. You'll be logged in automatically

### Create First Audit
1. Click "New Audit" button
2. Enter contract name: `TestToken`
3. Select blockchain: `Ethereum`
4. Paste this vulnerable contract:

```solidity
pragma solidity ^0.8.0;

contract TestToken {
    mapping(address => uint256) public balances;
    
    // Reentrancy vulnerability
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount);
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success);
        balances[msg.sender] -= amount;
    }
    
    // Access control vulnerability
    function mint(address to, uint256 amount) public {
        balances[to] += amount;
    }
}
```

5. Click "Start Audit"
6. View detected vulnerabilities
7. See clean code suggestions
8. Generate PDF report

## 📁 Project Structure

```
SecureChainAuditor/
├── backend/              # Node.js/Express API
│   ├── models/          # Database schemas
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   ├── server.js        # Main server file
│   └── package.json
│
├── frontend/            # React web app
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── components/  # Reusable components
│   │   └── App.js       # Main app component
│   └── package.json
│
├── README.md            # Full documentation
├── SETUP.md             # Detailed setup guide
├── FEATURES.md          # Feature documentation
├── DEPLOYMENT.md        # Deployment guide
└── SAMPLE_CONTRACTS.md  # Test contracts
```

## 🔑 Key Features

✅ **Automated Vulnerability Detection**
- Reentrancy attacks
- Integer overflow/underflow
- Access control flaws
- Gas inefficiencies
- Unchecked external calls
- Hardcoded values

✅ **Clean Code Generation**
- Automatic fixes
- Side-by-side comparison
- Copy-to-clipboard

✅ **Professional Reports**
- PDF generation
- Detailed analysis
- Remediation guides

✅ **Security Ratings**
- Pre-audit rating (1-5 stars)
- Post-audit rating (1-5 stars)

✅ **Subscription Tiers**
- Free: 3 audits/month
- Recommended: Unlimited ($49/month)
- Premium: All features ($199/month)

## 🧪 Test Accounts

You can create your own account, or use these for testing:

```
Email: test@example.com
Password: password123
```

## 📚 Documentation

- **README.md** - Full project documentation
- **SETUP.md** - Detailed setup instructions
- **FEATURES.md** - Complete feature list
- **DEPLOYMENT.md** - Production deployment guide
- **SAMPLE_CONTRACTS.md** - Test contracts

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill the process
kill -9 <PID>

# Restart
npm run dev
```

### MongoDB connection error
```bash
# Verify MongoDB is running
mongosh

# Check connection string in .env
# Should be: mongodb://localhost:27017/securechain-auditor
```

### CORS errors
- Ensure backend is running on `http://localhost:5000`
- Ensure frontend is running on `http://localhost:3000`
- Check browser console for exact error

### Module not found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Next Steps

1. **Explore the Dashboard**
   - View your audit history
   - Check usage statistics
   - Upgrade your subscription

2. **Test with Sample Contracts**
   - See SAMPLE_CONTRACTS.md for vulnerable contracts
   - Test the detection engine
   - Review generated reports

3. **Customize Vulnerabilities**
   - Edit `backend/services/vulnerabilityDetector.js`
   - Add new vulnerability patterns
   - Customize severity levels

4. **Deploy to Production**
   - Follow DEPLOYMENT.md guide
   - Choose your hosting provider
   - Configure environment variables

## 💡 Tips

- **Dark Mode**: The UI is optimized for dark mode
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Analysis**: Audits complete in seconds
- **Copy Code**: Click copy button to copy code snippets
- **PDF Reports**: Download professional audit reports

## 🔐 Security Notes

- Passwords are hashed with bcryptjs
- JWT tokens expire after 7 days
- All API endpoints require authentication
- MongoDB should be secured in production
- Change JWT_SECRET in production

## 📞 Support

- Check documentation files
- Review code comments
- Check browser console for errors
- Review backend logs with `npm run dev`

## 🎉 You're Ready!

Start auditing smart contracts with SecureChain Auditor™!

For detailed information, see the full documentation in README.md

---

**Happy auditing! 🔐**
