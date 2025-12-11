# SecureChain Auditor™ - Development Guide

Guide for developers contributing to SecureChain Auditor.

## Development Environment Setup

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)
- Git
- Code editor (VS Code recommended)
- Postman or Insomnia (for API testing)

### Initial Setup

```bash
# Clone repository
git clone https://github.com/yourusername/SecureChainAuditor.git
cd SecureChainAuditor

# Setup backend
cd backend
npm install
cp .env.example .env
# Edit .env with your settings

# Setup frontend
cd ../frontend
npm install
```

## Project Architecture

### Backend Architecture

```
backend/
├── server.js              # Express app setup
├── models/                # Mongoose schemas
│   ├── User.js
│   └── Audit.js
├── routes/                # API endpoints
│   ├── auth.js
│   ├── audits.js
│   ├── reports.js
│   └── user.js
├── middleware/            # Express middleware
│   └── auth.js
├── services/              # Business logic
│   ├── vulnerabilityDetector.js
│   └── reportGenerator.js
└── package.json
```

### Frontend Architecture

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── pages/             # Page components
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Dashboard.js
│   │   ├── AuditDetail.js
│   │   ├── Pricing.js
│   │   └── *.css
│   ├── components/        # Reusable components
│   │   ├── Navigation.js
│   │   └── Navigation.css
│   ├── App.js
│   ├── App.css
│   └── index.js
└── package.json
```

## Code Style Guide

### JavaScript/Node.js

**Naming Conventions:**
- Variables: `camelCase`
- Functions: `camelCase`
- Classes: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`

**Example:**
```javascript
// Variables
const userName = "John";
let userCount = 0;

// Functions
function getUserById(id) { }
const fetchAudits = async () => { };

// Classes
class VulnerabilityDetector { }

// Constants
const MAX_AUDIT_SIZE = 1000000;
```

**Code Style:**
- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Use arrow functions when appropriate
- Add comments for complex logic

```javascript
// Good
const calculateRating = (vulnerabilities) => {
  // Calculate based on severity
  const score = vulnerabilities.reduce((sum, vuln) => {
    return sum + getSeverityScore(vuln.severity);
  }, 0);
  
  return Math.max(1, 5 - Math.ceil(score / 5));
};

// Bad
const calculateRating=function(vulnerabilities){
  var score=0;
  for(var i=0;i<vulnerabilities.length;i++){
    score+=getSeverityScore(vulnerabilities[i].severity);
  }
  return Math.max(1,5-Math.ceil(score/5));
};
```

### React

**Component Structure:**
```javascript
import React, { useState, useEffect } from 'react';
import './ComponentName.css';

function ComponentName({ prop1, prop2 }) {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Side effects
  }, []);

  const handleClick = () => {
    // Event handler
  };

  return (
    <div className="component">
      {/* JSX */}
    </div>
  );
}

export default ComponentName;
```

**Best Practices:**
- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper prop types
- Add meaningful comments

## Adding New Features

### Adding a New Vulnerability Type

1. **Update Vulnerability Detector:**

```javascript
// backend/services/vulnerabilityDetector.js

this.vulnerabilityPatterns = {
  // ... existing patterns
  newVulnerability: {
    patterns: [
      /regex_pattern_1/,
      /regex_pattern_2/
    ],
    severity: 'High',
    description: 'Description of the vulnerability',
    remediation: 'How to fix it',
  }
};
```

2. **Test the Detection:**

```javascript
// Test in backend/test.js
const detector = require('./services/vulnerabilityDetector');
const code = 'vulnerable code here';
const results = detector.analyzeCode(code);
console.log(results);
```

3. **Update Frontend Display:**

```javascript
// frontend/src/pages/AuditDetail.js
// Add badge styling in App.css if needed
```

### Adding a New API Endpoint

1. **Create Route Handler:**

```javascript
// backend/routes/newRoute.js
const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/endpoint', auth, async (req, res) => {
  try {
    // Logic here
    res.json({ data: 'response' });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
});

module.exports = router;
```

2. **Register Route in Server:**

```javascript
// backend/server.js
app.use('/api/newRoute', require('./routes/newRoute'));
```

3. **Add Frontend Integration:**

```javascript
// frontend/src/pages/SomePage.js
const response = await axios.get('/api/newRoute/endpoint', {
  headers: { Authorization: `Bearer ${token}` }
});
```

### Adding a New Page

1. **Create Page Component:**

```javascript
// frontend/src/pages/NewPage.js
import React from 'react';
import './NewPage.css';

function NewPage() {
  return (
    <div className="new-page">
      {/* Page content */}
    </div>
  );
}

export default NewPage;
```

2. **Create Styles:**

```css
/* frontend/src/pages/NewPage.css */
.new-page {
  padding: 40px 0;
}
```

3. **Add Route:**

```javascript
// frontend/src/App.js
<Route path="/new-page" element={<NewPage />} />
```

## Testing

### Backend Testing

```bash
# Install testing dependencies
npm install --save-dev jest supertest

# Create test file
# backend/tests/auth.test.js

const request = require('supertest');
const app = require('../server');

describe('Auth Endpoints', () => {
  test('POST /api/auth/register should create user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe('test@example.com');
  });
});

# Run tests
npm test
```

### Frontend Testing

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom

# Create test file
# frontend/src/pages/Login.test.js

import { render, screen } from '@testing-library/react';
import Login from './Login';

test('renders login form', () => {
  render(<Login onLogin={() => {}} />);
  const emailInput = screen.getByPlaceholderText(/email/i);
  expect(emailInput).toBeInTheDocument();
});

# Run tests
npm test
```

## Database Management

### MongoDB Operations

```javascript
// Connect to MongoDB
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected'))
  .catch(err => console.error('Connection failed:', err));
```

### Creating Indexes

```javascript
// backend/models/Audit.js
auditSchema.index({ userId: 1, createdAt: -1 });
auditSchema.index({ status: 1 });
```

### Database Backup

```bash
# Backup
mongodump --uri "mongodb://localhost:27017/securechain-auditor" --out ./backup

# Restore
mongorestore --uri "mongodb://localhost:27017/securechain-auditor" ./backup
```

## Performance Optimization

### Backend Optimization

1. **Database Query Optimization:**
```javascript
// Bad: N+1 query problem
const audits = await Audit.find({ userId });
for (let audit of audits) {
  const user = await User.findById(audit.userId);
}

// Good: Use populate
const audits = await Audit.find({ userId }).populate('userId');
```

2. **Caching:**
```javascript
const cache = new Map();

function getCachedAudit(auditId) {
  if (cache.has(auditId)) {
    return cache.get(auditId);
  }
  // Fetch from DB
}
```

3. **Pagination:**
```javascript
router.get('/audits', auth, async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const skip = parseInt(req.query.skip) || 0;
  
  const audits = await Audit.find({ userId: req.userId })
    .limit(limit)
    .skip(skip);
  
  res.json(audits);
});
```

### Frontend Optimization

1. **Code Splitting:**
```javascript
// frontend/src/App.js
const Dashboard = React.lazy(() => import('./pages/Dashboard'));

<Suspense fallback={<div>Loading...</div>}>
  <Dashboard />
</Suspense>
```

2. **Memoization:**
```javascript
const MemoizedComponent = React.memo(function Component({ data }) {
  return <div>{data}</div>;
});
```

3. **Image Optimization:**
```javascript
// Use optimized images
<img src="image.webp" alt="description" loading="lazy" />
```

## Debugging

### Backend Debugging

```javascript
// Add logging
console.log('Debug info:', variable);

// Use debugger
debugger;

// Run with debugger
node --inspect server.js
```

### Frontend Debugging

```javascript
// Browser console
console.log('Debug:', variable);

// React DevTools
// Install React DevTools extension

// Network tab
// Check API requests and responses
```

## Git Workflow

### Branch Naming
- `feature/feature-name` - New features
- `bugfix/bug-name` - Bug fixes
- `hotfix/issue-name` - Urgent fixes
- `docs/documentation` - Documentation

### Commit Messages
```
feat: Add new vulnerability detection
fix: Resolve CORS issue
docs: Update API documentation
style: Format code
refactor: Restructure components
test: Add unit tests
```

### Pull Request Process
1. Create feature branch
2. Make changes
3. Write tests
4. Update documentation
5. Create pull request
6. Code review
7. Merge to main

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/securechain-auditor
JWT_SECRET=your_secret_key
NODE_ENV=development
LOG_LEVEL=debug
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

## Common Tasks

### Add New Dependency
```bash
# Backend
cd backend
npm install package-name

# Frontend
cd frontend
npm install package-name
```

### Update Dependencies
```bash
npm update
npm outdated  # Check for outdated packages
```

### Run Linter
```bash
npm install --save-dev eslint
npx eslint .
```

### Format Code
```bash
npm install --save-dev prettier
npx prettier --write .
```

## Troubleshooting

### Port Already in Use
```bash
lsof -i :5000
kill -9 <PID>
```

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Database Connection Issues
```bash
# Check MongoDB is running
mongosh

# Verify connection string
echo $MONGODB_URI
```

### CORS Errors
- Check backend CORS configuration
- Verify frontend URL in backend
- Check browser console for details

## Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Mongoose Documentation](https://mongoosejs.com/)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## Code Review Checklist

- [ ] Code follows style guide
- [ ] Tests are included
- [ ] Documentation is updated
- [ ] No console errors/warnings
- [ ] Performance is acceptable
- [ ] Security best practices followed
- [ ] Backward compatibility maintained

---

**Happy coding! 🚀**
