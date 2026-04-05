# DevSphere AI - Complete Deployment Guide

## 🚀 Deployment Overview

This guide covers deploying DevSphere AI:
- **Frontend**: Vercel (free tier)
- **Backend**: Render (free tier)
- **Database**: MongoDB Atlas (existing)

---

## 📋 Deployment Checklist

### ✅ Prerequisites
- [x] GitHub repo created (hardikkaurani/devsphere-ai)
- [x] MongoDB Atlas account & connection string
- [x] OpenAI API key (optional)
- [ ] Vercel account (free)
- [ ] Render account (free)

---

## 🔧 STEP 1: Backend Deployment (Render)

### 1.1 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (recommended)
3. Click **"New +"** → **"Web Service"**

### 1.2 Connect GitHub Repository
1. Select repository: `devsphere-ai`
2. Branch: `main`
3. Configure:
   - **Name**: `devsphere-api`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/index.js`
   - **Root Directory**: `backend`
   - **Plan**: `Free`

### 1.3 Add Environment Variables
In Render dashboard, add these variables:

```
NODE_ENV = production
PORT = 10000
MONGODB_URI = mongodb+srv://CodingMaster:Hardik01@programming.eguuykj.mongodb.net/?appName=Programming
JWT_SECRET = (generate: `openssl rand -base64 32`)
CORS_ORIGIN = https://devsphere-ai.vercel.app
OLLAMA_BASE_URL = http://localhost:11434
OLLAMA_MODEL = gemma:2b
```

### 1.4 Copy Your Backend URL
After deployment, copy the URL: `https://devsphere-api.onrender.com`

---

## 🎨 STEP 2: Frontend Deployment (Vercel)

### 2.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click **"Add New"** → **"Project"**

### 2.2 Connect GitHub Repository
1. Find and import `devsphere-ai` repo
2. Configure Build Settings:
   - **Framework**: Vite
   - **Build Command**: `npm run build:frontend`
   - **Output Directory**: `devsphere-frontend/dist`
   - **Install Command**: `npm install`

### 2.3 Add Environment Variables
In Vercel dashboard Project Settings → Environment Variables:

```
VITE_API_URL = https://devsphere-api.onrender.com/api/v1
```

### 2.4 Deploy
Click **"Deploy"** and wait for completion (~2-3 minutes)

---

## 🔗 STEP 3: Connect Frontend to Backend

### 3.1 Update Frontend API Configuration
After backend deploys, update in Vercel:
1. Project Settings → Environment Variables
2. Update `VITE_API_URL` to your Render backend URL
3. Redeploy

---

## ✅ Verification Checklist

- [ ] Backend deployed on Render (https://devsphere-api.onrender.com)
- [ ] Frontend deployed on Vercel (https://devsphere-ai.vercel.app)
- [ ] Environment variables set in both platforms
- [ ] Frontend can communicate with backend
- [ ] MongoDB connection working
- [ ] Authentication flow works end-to-end

---

## 🧪 Testing After Deployment

### Test Backend API
```bash
curl https://devsphere-api.onrender.com/health
```

### Test Frontend
Visit: https://devsphere-ai.vercel.app
- Check console for errors
- Try authentication flow
- Send a message to AI

---

## 🆘 Troubleshooting

### Backend won't start
- Check environment variables in Render
- Verify MongoDB URI is correct
- Check logs in Render dashboard

### Frontend shows blank page
- Clear browser cache
- Check VITE_API_URL in Vercel variables
- Verify CORS is configured correctly

### CORS errors
- Backend CORS_ORIGIN should match frontend URL
- Both URLs must include https://

---

## 📱 Important Notes

- **Free Tier Limitations**:
  - Render: Spins down after 15min inactivity
  - Vercel: Unlimited for static deployments
  - MongoDB: Free tier has usage limits

- **To Upgrade Later**:
  - Render: Paid plan ($7/month) - always running
  - Vercel: Pro ($20/month) - optional for advanced features

---

## 🎯 Final URLs

After successful deployment:

- **Frontend**: https://devsphere-ai.vercel.app
- **Backend API**: https://devsphere-api.onrender.com/api/v1
- **MongoDB**: Already connected via URI

---

## 📞 24/7 Support

Need help? Check:
- Render docs: https://render.com/docs
- Vercel docs: https://vercel.com/docs
- MongoDB docs: https://docs.mongodb.com/
