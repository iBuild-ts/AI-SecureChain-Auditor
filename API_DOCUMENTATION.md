# SecureChain Auditor™ - API Documentation

Complete API reference for SecureChain Auditor backend.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

All responses are JSON:

```json
{
  "message": "Success message",
  "data": { /* response data */ }
}
```

---

## Authentication Endpoints

### Register User

**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "name": "John Doe",
    "tier": "free"
  }
}
```

**Error (400):**
```json
{
  "message": "User already exists"
}
```

---

### Login

**POST** `/auth/login`

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "name": "John Doe",
    "tier": "recommended"
  }
}
```

**Error (401):**
```json
{
  "message": "Invalid credentials"
}
```

---

### Get Current User

**GET** `/auth/me`

Get authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "john@example.com",
  "name": "John Doe",
  "tier": "recommended",
  "auditCount": 5,
  "monthlyAuditLimit": null,
  "subscriptionExpiry": "2026-12-10T14:30:18.000Z",
  "createdAt": "2025-12-10T14:30:18.000Z"
}
```

---

## Audit Endpoints

### Create New Audit

**POST** `/audits/create`

Submit a smart contract for security audit.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "contractName": "MyToken",
  "contractCode": "pragma solidity ^0.8.0; contract MyToken { ... }",
  "chain": "ethereum"
}
```

**Chain Options:**
- `ethereum` - Ethereum mainnet
- `polygon` - Polygon network
- `bsc` - Binance Smart Chain
- `arbitrum` - Arbitrum One
- `optimism` - Optimism

**Response (201):**
```json
{
  "message": "Audit completed successfully",
  "audit": {
    "id": "507f1f77bcf86cd799439012",
    "contractName": "MyToken",
    "status": "completed",
    "preAuditRating": 3,
    "postAuditRating": 4,
    "vulnerabilityCount": 2,
    "createdAt": "2025-12-10T14:30:18.000Z"
  }
}
```

**Error (403):**
```json
{
  "message": "Free tier limit reached. Upgrade to continue auditing.",
  "limit": 3
}
```

---

### Get All User Audits

**GET** `/audits`

Retrieve all audits for authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional) - Number of results (default: 50)
- `skip` (optional) - Number of results to skip (default: 0)

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "contractName": "MyToken",
    "chain": "ethereum",
    "status": "completed",
    "preAuditRating": 3,
    "postAuditRating": 4,
    "vulnerabilities": [
      {
        "id": "reentrancy-0",
        "type": "reentrancy",
        "severity": "Critical",
        "description": "Potential reentrancy vulnerability detected",
        "location": "Line 15",
        "codeSnippet": "call()",
        "remediation": "Use checks-effects-interactions pattern",
        "fixedCode": "// Fixed code here"
      }
    ],
    "cleanCode": "// Clean code here",
    "reportGenerated": true,
    "createdAt": "2025-12-10T14:30:18.000Z",
    "completedAt": "2025-12-10T14:30:25.000Z"
  }
]
```

---

### Get Audit Details

**GET** `/audits/:auditId`

Get detailed information about a specific audit.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `auditId` - Audit ID (required)

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "contractName": "MyToken",
  "contractCode": "pragma solidity ^0.8.0; ...",
  "chain": "ethereum",
  "status": "completed",
  "preAuditRating": 3,
  "postAuditRating": 4,
  "vulnerabilities": [ /* array of vulnerabilities */ ],
  "cleanCode": "// Clean code here",
  "reportGenerated": true,
  "reportPath": "/reports/audit-507f1f77bcf86cd799439012.pdf",
  "createdAt": "2025-12-10T14:30:18.000Z",
  "completedAt": "2025-12-10T14:30:25.000Z"
}
```

**Error (404):**
```json
{
  "message": "Audit not found"
}
```

---

### Generate PDF Report

**POST** `/audits/:auditId/generate-report`

Generate a professional PDF report for an audit.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `auditId` - Audit ID (required)

**Response (200):**
```json
{
  "message": "Report generated successfully",
  "reportPath": "/reports/audit-507f1f77bcf86cd799439012.pdf"
}
```

---

### Download Report

**GET** `/audits/:auditId/download-report`

Download the PDF report for an audit.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `auditId` - Audit ID (required)

**Response:**
- File download (application/pdf)

---

## Report Endpoints

### Get Report Summary

**GET** `/reports/:auditId`

Get a summary of the audit report.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `auditId` - Audit ID (required)

**Response (200):**
```json
{
  "contractName": "MyToken",
  "chain": "ethereum",
  "createdAt": "2025-12-10T14:30:18.000Z",
  "preAuditRating": 3,
  "postAuditRating": 4,
  "vulnerabilities": {
    "critical": 1,
    "high": 1,
    "medium": 0,
    "low": 0,
    "total": 2
  },
  "reportGenerated": true,
  "completedAt": "2025-12-10T14:30:25.000Z"
}
```

---

### Get Vulnerabilities

**GET** `/reports/:auditId/vulnerabilities`

Get detailed vulnerability information.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `auditId` - Audit ID (required)

**Response (200):**
```json
{
  "contractName": "MyToken",
  "vulnerabilities": [
    {
      "id": "reentrancy-0",
      "type": "reentrancy",
      "severity": "Critical",
      "description": "Potential reentrancy vulnerability detected",
      "location": "Line 15",
      "codeSnippet": "(bool success, ) = msg.sender.call{value: amount}(\"\");",
      "remediation": "Use checks-effects-interactions pattern or reentrancy guards",
      "fixedCode": "// Use ReentrancyGuard from OpenZeppelin\nimport \"@openzeppelin/contracts/security/ReentrancyGuard.sol\";\ncontract MyContract is ReentrancyGuard {\n  function withdraw() public nonReentrant { ... }\n}"
    }
  ]
}
```

---

### Get Clean Code

**GET** `/reports/:auditId/clean-code`

Get the cleaned and fixed version of the contract.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `auditId` - Audit ID (required)

**Response (200):**
```json
{
  "contractName": "MyToken",
  "cleanCode": "pragma solidity ^0.8.0;\n\nimport \"@openzeppelin/contracts/security/ReentrancyGuard.sol\";\n\ncontract MyToken is ReentrancyGuard {\n  // Fixed code here\n}"
}
```

---

## User Endpoints

### Get User Profile

**GET** `/user/profile`

Get authenticated user's profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "john@example.com",
  "name": "John Doe",
  "tier": "recommended",
  "auditCount": 5,
  "monthlyAuditLimit": null,
  "subscriptionExpiry": "2026-12-10T14:30:18.000Z",
  "createdAt": "2025-12-10T14:30:18.000Z"
}
```

---

### Upgrade Subscription

**POST** `/user/upgrade`

Upgrade user's subscription tier.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "tier": "premium"
}
```

**Valid Tiers:**
- `free` - Free tier
- `recommended` - Recommended tier
- `premium` - Premium tier

**Response (200):**
```json
{
  "message": "Subscription upgraded successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "tier": "premium",
    "subscriptionExpiry": "2026-12-10T14:30:18.000Z"
  }
}
```

---

### Get Usage Statistics

**GET** `/user/stats`

Get user's usage statistics and metrics.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "tier": "recommended",
  "totalAudits": 15,
  "monthlyAuditLimit": null,
  "auditCount": 15,
  "vulnerabilitiesFound": 42,
  "averageRating": "3.87"
}
```

---

## Health Check

### API Health

**GET** `/health`

Check if API is running.

**Response (200):**
```json
{
  "status": "SecureChain Auditor is running"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Please provide all required fields"
}
```

### 401 Unauthorized
```json
{
  "message": "Token is not valid"
}
```

### 403 Forbidden
```json
{
  "message": "Not authorized"
}
```

### 404 Not Found
```json
{
  "message": "Audit not found"
}
```

### 500 Server Error
```json
{
  "message": "Server error",
  "error": "Error details"
}
```

---

## Rate Limiting

- Free tier: 3 audits per month
- Recommended tier: Unlimited audits
- Premium tier: Unlimited audits + API access

---

## Pagination

For endpoints that return arrays, use query parameters:

```
GET /audits?limit=10&skip=0
```

- `limit` - Number of results (default: 50, max: 100)
- `skip` - Number of results to skip (default: 0)

---

## Sorting

Sort results by adding `sort` parameter:

```
GET /audits?sort=-createdAt
```

- `-` prefix for descending order
- No prefix for ascending order

---

## Filtering

Filter results by adding query parameters:

```
GET /audits?chain=ethereum&status=completed
```

---

## Example Requests

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Create Audit:**
```bash
curl -X POST http://localhost:5000/api/audits/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "contractName": "MyToken",
    "contractCode": "pragma solidity ^0.8.0; ...",
    "chain": "ethereum"
  }'
```

### Using JavaScript/Axios

```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Create audit
const response = await api.post('/audits/create', {
  contractName: 'MyToken',
  contractCode: 'pragma solidity ^0.8.0; ...',
  chain: 'ethereum'
});

console.log(response.data);
```

### Using Python/Requests

```python
import requests

headers = {
    'Authorization': f'Bearer {token}'
}

response = requests.post(
    'http://localhost:5000/api/audits/create',
    json={
        'contractName': 'MyToken',
        'contractCode': 'pragma solidity ^0.8.0; ...',
        'chain': 'ethereum'
    },
    headers=headers
)

print(response.json())
```

---

## Webhook Events (Premium)

Premium users can receive webhook notifications:

- `audit.created` - Audit started
- `audit.completed` - Audit finished
- `report.generated` - Report ready
- `subscription.upgraded` - Plan upgraded

---

## API Limits

- Request timeout: 30 seconds
- Max request size: 50MB
- Max response size: 50MB
- Rate limit: 100 requests per minute (free), unlimited (premium)

---

## Versioning

Current API version: **v1**

Future versions will be available at `/api/v2`, etc.

---

## Support

For API support:
- Email: api-support@securechainauditor.com
- Documentation: https://docs.securechainauditor.com
- Status: https://status.securechainauditor.com

---

**Last Updated:** December 10, 2025
