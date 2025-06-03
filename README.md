# CompanyGrow

CompanyGrow is a workforce development platform that helps organizations:
- Offer and manage training courses
- Assign projects based on employee skills
- Track progress and award badge-based bonuses via Stripe
- Display performance analytics on dashboards

Built with a React frontend (secured by Clerk) and a Node/Express backend (MongoDB, Cloudinary, Stripe).

---

## Tech Stack

- **Frontend**: React, Clerk, Tailwind CSS, Chart.js  
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Cloudinary, Stripe  
- **Hosting**: Frontend on Vercel, Backend on Render  

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/your-org/companygrow.git
cd companygrow

2. Create environment files
Frontend (frontend/.env)

REACT_APP_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
REACT_APP_BACKEND_URL=https://your-backend.onrender.com

Backend (backend/.env)

PORT=5000
MONGO_URI=mongodb://localhost:27017/companygrow

STRIPE_SECRET_KEY=your_stripe_secret_key

CLOUDINARY_CLOUD_NAME=…
CLOUDINARY_API_KEY=…
CLOUDINARY_API_SECRET=…
CLOUDINARY_URL=…

CLERK_PUBLISHABLE_KEY=…
CLERK_SECRET_KEY=…

3. Install dependencies

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

4. Run locally

In one terminal:

cd backend
npm run dev

In another:

cd frontend
npm start

    Backend runs at http://localhost:5000

    Frontend runs at http://localhost:3000

Deployment

    Push backend folder to a Git repo, connect and deploy on Render. Set environment variables there.

    Push frontend folder to a Git repo, deploy on Vercel. Set REACT_APP_CLERK_PUBLISHABLE_KEY and REACT_APP_BACKEND_URL in Vercel’s settings.

Once both are live, the app is ready for use.