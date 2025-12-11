# SecureChain Auditor™

**AI-Powered Smart Contract Audit Platform**

SecureChain Auditor™ is a cutting-edge, AI-powered software platform designed to deliver professional, automated smart contract audits with unparalleled accuracy and efficiency. Positioned as the global gold standard for blockchain security, it serves as an independent third-party auditor.

## 🚀 Features

- **Automated Vulnerability Detection**: Scans for reentrancy attacks, integer overflows, access control flaws, gas inefficiencies, and more
- **Clean Code Generation**: Automatically suggests and applies fixes to produce optimized, secure code
- **Professional PDF Reports**: Detailed audit reports with vulnerability breakdown and remediation guides
- **Pre & Post-Audit Ratings**: 1-5 star security ratings before and after fixes
- **Multi-Chain Support**: Ethereum, Polygon, Binance Smart Chain, Arbitrum, Optimism
- **User-Friendly Dashboard**: Modern web interface with real-time audit tracking
- **Subscription Tiers**: Free, Recommended, and Premium plans

## 📋 Tech Stack

**Backend:**
- Node.js + Express
- MongoDB
- PDFKit for report generation
- JWT authentication

**Frontend:**
- React 18
- React Router
- Axios for API calls
- Lucide React icons
- Modern CSS with responsive design

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/securechain-auditor
JWT_SECRET=your_secure_secret_key_here
NODE_ENV=development
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 📖 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Audits
- `POST /api/audits/create` - Create new audit
- `GET /api/audits` - Get user's audits
- `GET /api/audits/:auditId` - Get audit details
- `POST /api/audits/:auditId/generate-report` - Generate PDF report
- `GET /api/audits/:auditId/download-report` - Download report

### Reports
- `GET /api/reports/:auditId` - Get report summary
- `GET /api/reports/:auditId/vulnerabilities` - Get vulnerabilities
- `GET /api/reports/:auditId/clean-code` - Get clean code

### User
- `GET /api/user/profile` - Get user profile
- `POST /api/user/upgrade` - Upgrade subscription
- `GET /api/user/stats` - Get usage statistics

## 🔍 Vulnerability Detection

The platform detects the following vulnerability types:

1. **Reentrancy** (Critical)
   - Detects unsafe external calls
   - Suggests ReentrancyGuard pattern

2. **Integer Overflow/Underflow** (High)
   - Identifies unsafe arithmetic operations
   - Recommends SafeMath or Solidity 0.8+

3. **Access Control** (High)
   - Finds missing permission checks
   - Suggests onlyOwner modifiers

4. **Gas Optimization** (Medium)
   - Identifies inefficient code patterns
   - Recommends memory caching

5. **Unchecked Calls** (High)
   - Detects unchecked external calls
   - Suggests return value validation

6. **Hardcoded Values** (Medium)
   - Finds hardcoded addresses
   - Recommends parameterization

## 💳 Pricing Tiers

### Free Trial
- 3 audits/month
- Basic vulnerability scanning
- Summary reports
- Pre-audit rating only

### Recommended ($49/month or $499/year)
- Unlimited audits
- Full PDF reports
- Clean code suggestions
- Pre & post-audit ratings
- Priority support

### Premium Exclusive ($199/month or $1,999/year)
- All Recommended features
- Advanced AI simulations
- Manual expert review
- Forensic-level analysis
- Unlimited API calls
- White-label reports
- 24/7 dedicated support

## 🔐 Security

- JWT-based authentication
- Password hashing with bcryptjs
- MongoDB connection security
- CORS protection
- Input validation

## 📊 Database Schema

### User
```javascript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  tier: String (free|recommended|premium),
  auditCount: Number,
  monthlyAuditLimit: Number,
  subscriptionExpiry: Date,
  createdAt: Date
}
```

### Audit
```javascript
{
  userId: ObjectId,
  contractName: String,
  contractCode: String,
  chain: String,
  status: String (pending|analyzing|completed|failed),
  preAuditRating: Number (1-5),
  postAuditRating: Number (1-5),
  vulnerabilities: Array,
  cleanCode: String,
  reportGenerated: Boolean,
  reportPath: String,
  createdAt: Date,
  completedAt: Date
}
```

## 🚀 Deployment

### Backend (Heroku/Railway/Render)
```bash
# Set environment variables in deployment platform
# Deploy using git push or platform CLI
```

### Frontend (Netlify/Vercel)
```bash
npm run build
# Deploy the build folder
```

## 📝 Usage Example

1. **Register/Login**: Create an account or login
2. **Create Audit**: Paste your Solidity contract code
3. **Review Results**: See vulnerabilities, ratings, and clean code
4. **Generate Report**: Create professional PDF report
5. **Upgrade Plan**: Access advanced features with paid tiers

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 📞 Support

For support, email support@securechainauditor.com or open an issue on GitHub.

---

## 🎯 Creator & Contact

**SecureChain Auditor™** is created and maintained by **@lahwealth**

### Support the Creator

**Buy me a coffee with ETH:**
```
0xdf49e29b6840d7ba57e4b5acddc770047f67ff13
```
[💰 Send ETH](https://etherscan.io/address/0xdf49e29b6840d7ba57e4b5acddc770047f67ff13)

### Follow & Connect

- **Twitter/X:** [@lahwealth](https://x.com/lahwealth)
- **Upwork:** [Hire me on Upwork](https://www.upwork.com/freelancers/~01857093015b424e00)

---

## ©️ Copyright & Trademark

**SecureChain Auditor™** © 2025 by **@lahwealth**. All rights reserved.

This project and all its contents, including but not limited to:
- Source code
- Documentation
- Design assets
- Branding materials
- Vulnerability detection algorithms
- Report generation systems

are the exclusive intellectual property of **@lahwealth** and are protected under international copyright and trademark laws.

### License Terms

- **Personal Use:** Permitted for learning and testing purposes
- **Commercial Use:** Requires explicit written permission from the creator
- **Redistribution:** Not permitted without written consent
- **Modification:** Permitted for personal use only

For licensing inquiries or commercial use, please contact:
- **Upwork:** [https://www.upwork.com/freelancers/~01857093015b424e00](https://www.upwork.com/freelancers/~01857093015b424e00)
- **Twitter/X:** [@lahwealth](https://x.com/lahwealth)

---

**SecureChain Auditor™** - Securing the blockchain, one contract at a time. 🔐

*Made with ❤️ by [@lahwealth](https://x.com/lahwealth)*
