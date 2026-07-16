# ShopKeeper Management Deployment Guide

This guide details the steps to deploy both the Backend (Express application) and the Frontend (Vite React application) to production.

---

## 1. Backend Deployment

You can deploy the backend to platforms like **Render**, **Koyeb**, **Heroku**, or any VPS.

### Required Environment Variables

When deploying the backend, configure the following environment variables in your hosting environment's dashboard:

| Variable | Description | Example |
|---|---|---|
| `MONGO_URI` | MongoDB Atlas Connection String | `mongodb+srv://<username>:<password>@cluster.mongodb.net/shopkeeper` |
| `JWT_SECRET` | Secret key for signing authentication JSON Web Tokens | `some_long_random_hash` |
| `PORT` | Port number the backend server runs on | `3000` (or leave default if managed by host) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name (for product image uploads) | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `your_api_key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `your_api_secret` |

### Steps (Example using Render)
1. Sign in to [Render](https://render.com) and click **New > Web Service**.
2. Connect your Git repository containing the backend.
3. Set the **Root Directory** to `Backend`.
4. Set the **Runtime** to `Node`.
5. Set the **Build Command** to `npm install`.
6. Set the **Start Command** to `node server.js` (or `npm start`).
7. Open the **Environment** tab and add the Environment Variables listed above.
8. Click **Deploy Web Service**.

---

## 2. Frontend Deployment

You can deploy the frontend to static hosting platforms like **Vercel**, **Netlify**, or **Github Pages**.

### Required Environment Variables

During build-time, Vite needs to know the deployed URL of your backend.

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Deployed URL of your backend API | `https://your-backend-url.onrender.com/api` |

### Steps (Example using Vercel)
1. Sign in to [Vercel](https://vercel.com) and click **Add New > Project**.
2. Connect your Git repository containing the project.
3. In the project configure settings:
   - Set **Root Directory** to `Frontend`.
   - Set **Framework Preset** to `Vite`.
   - Set **Build Command** to `npm run build`.
   - Set **Output Directory** to `dist`.
4. Expand the **Environment Variables** section and add:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.onrender.com/api`
5. Click **Deploy**.
