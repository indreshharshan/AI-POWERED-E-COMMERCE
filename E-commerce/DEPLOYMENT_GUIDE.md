# Complete Step-by-Step Deployment Guide for Shopper E-Commerce

This guide covers deploying your MERN stack application (MongoDB, Express, React/Vite, Node.js) across the most popular and reliable cloud providers:
- **Database:** MongoDB Atlas
- **Backend (Node.js):** Render (or Railway)
- **Frontend & Admin (React/Vite):** Vercel

---

## Step 1: Database Setup (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and log in.
2. If you haven't already, create a **Free Cluster**.
3. Under **Network Access**, ensure you have added IP `0.0.0.0/0` (Allow access from anywhere) so your cloud backend can connect to it.
4. Go to **Database Access** and ensure your user has the correct privileges.
5. Go to **Clusters** > **Connect** > **Connect your application** and copy the `MONGO_URI`. 
   *(Note: You already have this in your `.env` file, but make sure the password `5522` and username `indresh` are correct).*

---

## Step 2: Deploying the Backend (Render.com)

Render is great for hosting Node.js APIs.

1. Create an account on [Render](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository that contains this project.
4. Configure the Web Service:
   - **Name:** `shopper-backend` (or similar)
   - **Root Directory:** `backend` *(⚠️ Important: Since your backend is in a subfolder, you must specify this)*
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start` (or `node index.js`)
5. Scroll down to **Environment Variables** and click **Advanced** -> **Add Environment Variable**. Add all variables from your `backend/.env` file. **Make sure to update the following:**
   - `PORT`: (Leave empty or set to `4000`, Render will assign one automatically)
   - `BACKEND_URL`: Wait until Render generates your URL (e.g., `https://shopper-backend.onrender.com`), then set it to that.
   - `FRONTEND_URL`: Set this later to your Vercel Frontend URL (e.g., `https://shopper-frontend.vercel.app`) to fix CORS issues.
   - `CALLBACK_URL`: `https://your-render-backend-url.onrender.com/auth/google/callback`
   - Add all your `CLOUDINARY`, `STRIPE`, `RAZORPAY`, `GROQ`, and `RESEND` keys here exactly as they are in your local `.env`.
6. Click **Create Web Service**. Wait for the deployment to finish.
7. **Copy the deployed backend URL** (e.g., `https://shopper-backend.onrender.com`).

---

## Step 3: Update Google OAuth Settings

Since your backend URL changed, you must tell Google to accept logins from the new URL.

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Navigate to **APIs & Services > Credentials**.
3. Edit your OAuth 2.0 Client ID.
4. Under **Authorized redirect URIs**, add your new live backend callback URL:
   `https://<your-render-backend-url>.onrender.com/auth/google/callback`
5. Save changes.

---

## Step 4: Deploying the Frontend (Vercel)

Vercel is the best place to host Vite/React applications.

1. Create an account on [Vercel](https://vercel.com/).
2. Click **Add New... > Project**.
3. Import your GitHub repository.
4. In the configuration screen:
   - **Project Name:** `shopper-frontend`
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend` *(⚠️ Important)*
5. Open the **Environment Variables** dropdown and add the variables from your `frontend/.env`:
   - `VITE_API_URL`: **Paste your Render Backend URL here** (e.g., `https://shopper-backend.onrender.com`) - *Make sure there is no trailing slash.*
   - `VITE_RAZORPAY_KEY_ID`: `rzp_test_RyFgUmaZdXKxZE`
   - `VITE_STRIPE_PUBLIC_KEY`: `pk_test_51SkPIC1iL7PMyVFS`
6. Click **Deploy**. Vercel will build and host your frontend.
7. **Copy the deployed frontend URL** (e.g., `https://shopper-frontend.vercel.app`).
8. **CRITICAL:** Go back to your Render Backend dashboard, edit the `FRONTEND_URL` environment variable, and set it to your new Vercel Frontend URL. Restart the backend.

---

## Step 5: Deploying the Admin Panel (Vercel)

You will repeat the exact same steps as the Frontend, but for the Admin folder.

1. Go to Vercel and click **Add New... > Project**.
2. Import the same GitHub repository again.
3. Configuration:
   - **Project Name:** `shopper-admin`
   - **Framework Preset:** `Vite`
   - **Root Directory:** `admin` *(⚠️ Important)*
4. Under **Environment Variables**, add the variables required for the admin panel (if you have an `.env` in the admin folder, typically `VITE_API_URL`).
   - `VITE_API_URL`: **Paste your Render Backend URL here**.
5. Click **Deploy**.

---

## Step 6: Final Testing
1. Visit your live Frontend URL on Vercel.
2. Try creating a test user, browsing products, and checking the cart.
3. Test a payment using your Stripe/Razorpay test cards.
4. Visit your Admin URL on Vercel, log in with your Admin credentials, and ensure you can view the orders and add products.

Congratulations! Your MERN stack E-commerce application is fully deployed!
