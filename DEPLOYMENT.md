# SecureChain Auditor™ - Deployment Guide

## Deployment Overview

This guide covers deploying SecureChain Auditor to production environments.

## Backend Deployment

### Option 1: Heroku (Recommended for Beginners)

#### Prerequisites
- Heroku account (free tier available)
- Heroku CLI installed
- Git repository initialized

#### Steps

1. **Install Heroku CLI**
```bash
brew tap heroku/brew && brew install heroku
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create Heroku App**
```bash
cd backend
heroku create your-app-name
```

4. **Add MongoDB Atlas**
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster
- Get connection string
- Set environment variable:
```bash
heroku config:set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/securechain-auditor
```

5. **Set JWT Secret**
```bash
heroku config:set JWT_SECRET=$(openssl rand -hex 32)
```

6. **Deploy**
```bash
git push heroku main
```

7. **View Logs**
```bash
heroku logs --tail
```

### Option 2: Railway (Modern Alternative)

1. **Connect GitHub Repository**
- Go to [Railway.app](https://railway.app)
- Click "New Project"
- Select "Deploy from GitHub"
- Connect your repository

2. **Configure Environment**
- Add variables in Railway dashboard:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `NODE_ENV=production`

3. **Deploy**
- Railway auto-deploys on push to main

### Option 3: AWS EC2

1. **Launch EC2 Instance**
```bash
# Ubuntu 20.04 LTS
# t2.micro (free tier eligible)
```

2. **Connect and Setup**
```bash
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
sudo apt install -y mongodb

# Start MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

3. **Deploy Application**
```bash
git clone your-repo
cd SecureChainAuditor/backend
npm install
cp .env.example .env
# Edit .env with production values
npm start
```

4. **Setup PM2 for Process Management**
```bash
npm install -g pm2
pm2 start server.js --name "securechain-backend"
pm2 startup
pm2 save
```

5. **Setup Nginx Reverse Proxy**
```bash
sudo apt install -y nginx

# Create nginx config
sudo nano /etc/nginx/sites-available/default
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo systemctl restart nginx
```

### Option 4: Docker Deployment

1. **Create Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

2. **Create .dockerignore**
```
node_modules
npm-debug.log
.env
.git
```

3. **Build and Run**
```bash
docker build -t securechain-backend .
docker run -p 5000:5000 \
  -e MONGODB_URI=your_mongodb_uri \
  -e JWT_SECRET=your_secret \
  securechain-backend
```

4. **Deploy to Docker Hub**
```bash
docker tag securechain-backend your-username/securechain-backend
docker push your-username/securechain-backend
```

## Frontend Deployment

### Option 1: Netlify (Recommended)

1. **Build the App**
```bash
cd frontend
npm run build
```

2. **Connect to Netlify**
- Go to [Netlify](https://netlify.com)
- Click "New site from Git"
- Connect GitHub repository
- Set build command: `npm run build`
- Set publish directory: `build`

3. **Configure Environment**
- Add environment variable in Netlify dashboard:
  - `REACT_APP_API_URL=https://your-backend-url.com`

4. **Deploy**
- Netlify auto-deploys on push to main

### Option 2: Vercel

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
cd frontend
vercel
```

3. **Configure Environment**
- Add `REACT_APP_API_URL` in Vercel dashboard

### Option 3: GitHub Pages

1. **Update package.json**
```json
{
  "homepage": "https://yourusername.github.io/SecureChainAuditor"
}
```

2. **Install gh-pages**
```bash
npm install --save-dev gh-pages
```

3. **Add Deploy Scripts**
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

4. **Deploy**
```bash
npm run deploy
```

### Option 4: AWS S3 + CloudFront

1. **Build App**
```bash
npm run build
```

2. **Create S3 Bucket**
```bash
aws s3 mb s3://your-bucket-name
```

3. **Upload Files**
```bash
aws s3 sync build/ s3://your-bucket-name --delete
```

4. **Setup CloudFront**
- Create CloudFront distribution
- Point to S3 bucket
- Configure SSL certificate

## Production Checklist

### Backend
- [ ] Change `JWT_SECRET` to strong random value
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for frontend domain
- [ ] Setup database backups
- [ ] Enable MongoDB authentication
- [ ] Configure rate limiting
- [ ] Setup error logging (Sentry)
- [ ] Enable GZIP compression
- [ ] Setup monitoring (New Relic, DataDog)

### Frontend
- [ ] Update API URL to production backend
- [ ] Enable HTTPS
- [ ] Setup analytics (Google Analytics)
- [ ] Configure error tracking (Sentry)
- [ ] Optimize images
- [ ] Enable caching headers
- [ ] Setup CDN
- [ ] Configure security headers

### General
- [ ] Setup domain name
- [ ] Configure SSL/TLS certificate
- [ ] Setup email service (SendGrid, Mailgun)
- [ ] Configure backup strategy
- [ ] Setup monitoring and alerts
- [ ] Create runbook for common issues
- [ ] Setup CI/CD pipeline
- [ ] Configure log aggregation

## Environment Variables

### Backend Production
```
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=<strong-random-secret>
NODE_ENV=production
FRONTEND_URL=https://your-frontend.com
```

### Frontend Production
```
REACT_APP_API_URL=https://your-backend.com
REACT_APP_ENV=production
```

## SSL/TLS Certificate

### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d your-domain.com

# Auto-renew
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

## Monitoring & Logging

### Backend Monitoring
```bash
# Install PM2 Plus for monitoring
pm2 plus

# View logs
pm2 logs

# Monitor performance
pm2 monit
```

### Error Tracking (Sentry)
```bash
npm install @sentry/node

# In server.js
const Sentry = require("@sentry/node");
Sentry.init({ dsn: "your-sentry-dsn" });
```

## Database Backup

### MongoDB Atlas Automatic Backups
- Enabled by default on paid plans
- Free tier: manual backups only

### Manual Backup
```bash
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/db" --out ./backup
```

## Performance Optimization

### Backend
- Enable gzip compression
- Implement caching
- Use CDN for static files
- Optimize database queries
- Implement pagination

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- CSS minification
- JavaScript minification

## Scaling Strategy

### Horizontal Scaling
1. Load balancer (Nginx, HAProxy)
2. Multiple backend instances
3. Shared database
4. Session storage (Redis)

### Vertical Scaling
1. Upgrade server resources
2. Optimize code
3. Cache frequently accessed data

## Disaster Recovery

### Backup Strategy
- Daily database backups
- Weekly full backups
- Monthly archive backups
- Test restore procedures

### Recovery Plan
- Document recovery procedures
- Test recovery regularly
- Maintain runbooks
- Setup alerts for failures

## Cost Optimization

### Backend
- Use free tier: Heroku, Railway
- Shared database: MongoDB Atlas free
- Monitor resource usage
- Auto-scale based on demand

### Frontend
- Use free tier: Netlify, Vercel
- CDN caching
- Compress assets
- Monitor bandwidth

## Support & Troubleshooting

### Common Issues

**502 Bad Gateway**
- Check backend is running
- Verify environment variables
- Check database connection

**CORS Errors**
- Update CORS configuration
- Verify frontend URL in backend
- Check browser console

**Database Connection Failed**
- Verify connection string
- Check IP whitelist (MongoDB Atlas)
- Verify credentials

**High Memory Usage**
- Check for memory leaks
- Implement pagination
- Use streaming for large files

---

**Successfully deployed! 🚀**

For more help, refer to the documentation or contact support.
