# CompanyGrow

**CompanyGrow** is a smart workforce development platform that enables organizations to nurture employee growth through tailored training, intelligent project allocation, and real-time performance rewards. It matches employees to projects based on skills, tracks training progress, and rewards achievements with badge-based bonuses. With live analytics and a skill-driven ecosystem, CompanyGrow keeps teams engaged, productive, and continuously evolving.

---

## Table of Contents

1. [Features](#features)  
2. [Tech Stack](#tech-stack)  
3. [Environment Configuration](#environment-configuration)  
   - [Frontend](#frontend)  
   - [Backend](#backend)  
4. [Getting Started](#getting-started)  
   - [Prerequisites](#prerequisites)  
   - [Installation](#installation)  
   - [Running Locally](#running-locally)  
5. [Project Structure](#project-structure)  
6. [Key Modules & Functionality](#key-modules--functionality)  
   - [Training Course Catalog](#training-course-catalog)  
   - [Employee Profiles](#employee-profiles)  
   - [Skill-Based Project Allocation](#skill-based-project-allocation)  
   - [Stripe Payment & Badge Rewards](#stripe-payment--badge-rewards)  
   - [Performance Analytics](#performance-analytics)  
   - [Admin Dashboard](#admin-dashboard)  
7. [API Endpoints](#api-endpoints)  
8. [Deployment](#deployment)  
9. [Contributing](#contributing)  
10. [License](#license)  

---

## Features

- **Training Course Catalog**  
  - Admins/managers can create, edit, and delete courses.  
  - Employees can browse, filter by category/skill level, and enroll in courses.  

- **Employee Profiles**  
  - Maintain user profiles including skills, experience, and training progress.  
  - Visual progress bars for milestones, completed courses, and earned badges.  

- **Skill-Based Project Allocation**  
  - Admins/managers assign projects to employees based on skill sets and completed training.  
  - Employees track project milestones and progress in real-time.  

- **Stripe Payment & Badge Rewards**  
  - Employees earn badges/tokens on course or project completion.  
  - Badge counts are processed via Stripe for performance-based bonuses.  

- **Performance Analytics**  
  - Track training/project metrics and badge counts over time.  
  - Visualize performance with interactive graphs (Chart.js or Recharts).  

- **Admin Dashboard**  
  - Central panel to manage courses, employees, and projects.  
  - Real-time analytics and badge allocation overview.  

---

## Tech Stack

- **Frontend**  
  - React.js (functional components + hooks)  
  - Clerk (authentication)  
  - Tailwind CSS  
  - Chart.js / Recharts (for graphs)  

- **Backend**  
  - Node.js + Express.js  
  - MongoDB (Mongoose)  
  - Cloudinary (media storage)  
  - Stripe (badge-based reward payments)  

- **Hosting / Deployment**  
  - Frontend: Vercel  
  - Backend: Render (or similar)  
  - MongoDB: MongoDB Atlas (or local during development)  

---

## Environment Configuration

### Frontend

Create a `.env` file in the **frontend** directory with:

```bash
REACT_APP_CLERK_PUBLISHABLE_KEY=  # Your Clerk publishable key
REACT_APP_BACKEND_URL=            # e.g. https://your-backend.onrender.com


Backend

Create a .env file in the backend directory with:
# Server
PORT=5000

# Database
MONGO_URI=mongodb://localhost:27017/companygrow

# Stripe
STRIPE_SECRET_KEY=  # Your Stripe secret key

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_URL=

# Clerk (authentication)
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=


Getting Started
Prerequisites

    Node.js >= 16.x and npm/yarn

    MongoDB (local or Atlas)

    Cloudinary account (for media uploads)

    Stripe account (for badge-based payments)

    Clerk account (for authentication)

    Git

Installation

    Clone the repository
    git clone https://github.com/your-org/companygrow.git
cd companygrow
Install backend dependencies

cd backend
npm install
# or
yarn install

Install frontend dependencies

    cd ../frontend
    npm install
    # or
    yarn install

Running Locally
1. Start the Backend Server

cd backend
npm run dev
# or
yarn dev

    The Express server will start on http://localhost:5000 by default (configured in .env).

    It connects to MongoDB, configures Cloudinary, Stripe, and sets up all routes.

2. Start the Frontend

cd ../frontend
npm start
# or
yarn start

    The React app will launch on http://localhost:3000.

    It consumes the backend APIs and uses Clerk for authentication.

    Tip: Open two terminal windows/tabs to run both servers concurrently.

Project Structure

companygrow/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── badgeController.js
│   │   ├── courseController.js
│   │   └── projectController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleCheck.js
│   ├── models/
│   │   ├── Badge.js
│   │   ├── Course.js
│   │   ├── Project.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── badgeRoutes.js
│   │   ├── courseRoutes.js
│   │   └── projectRoutes.js
│   ├── utils/
│   │   ├── cloudinaryConfig.js
│   │   └── stripeConfig.js
│   ├── app.js
│   ├── server.js
│   └── .env
└── frontend/
    ├── public/
    │   ├── index.html
    │   └── favicon.ico
    ├── src/
    │   ├── api/
    │   │   ├── badgeApi.js
    │   │   ├── courseApi.js
    │   │   └── projectApi.js
    │   ├── components/
    │   │   ├── Admin/
    │   │   │   ├── CreateCourseModal.jsx
    │   │   │   ├── CreateProjectModal.jsx
    │   │   │   ├── EditCourseModal.jsx
    │   │   │   ├── EditProjectModal.jsx
    │   │   │   └── AnalyticsDashboard.jsx
    │   │   ├── Badge/
    │   │   │   ├── BadgeCard.jsx
    │   │   │   └── BadgeList.jsx
    │   │   ├── Courses/
    │   │   │   ├── CourseCard.jsx
    │   │   │   ├── CourseList.jsx
    │   │   │   └── CourseDetails.jsx
    │   │   ├── Projects/
    │   │   │   ├── ProjectCard.jsx
    │   │   │   ├── ProjectList.jsx
    │   │   │   └── ProjectDetails.jsx
    │   │   ├── Shared/
    │   │   │   ├── Header.jsx
    │   │   │   ├── Footer.jsx
    │   │   │   └── Spinner.jsx
    │   │   └── Analytics/
    │   │       ├── PerformanceChart.jsx
    │   │       └── ProgressGraph.jsx
    │   ├── pages/
    │   │   ├── AdminPanel.jsx
    │   │   ├── CoursePage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── ProjectPage.jsx
    │   │   └── ProfilePage.jsx
    │   ├── routes/
    │   │   └── AppRouter.jsx
    │   ├── utils/
    │   │   ├── auth.js
    │   │   └── constants.js
    │   ├── App.jsx
    │   ├── index.jsx
    │   └── tailwind.css
    └── .env
├── .gitignore
└── README.md

Key Modules & Functionality
Training Course Catalog

    CRUD operations (Admin)

        Create, edit, delete courses (title, category, description, thumbnail, sections).

        Each section holds a title, duration, resources link, and order.

    Employee View

        Browseable, filterable list of courses by category and skill tags.

        Course details page:

            Course overview (description, category, duration, tags).

            Chapters/sections with checkboxes to mark progress.

            Visual progress bar showing percentage completed.

            “Claim Reward” button when all sections are completed (issues badge via Stripe).

Employee Profiles

    User Schema (Backend)

    {
      _id: ObjectId,
      name: String,
      email: String,
      position: String,
      department: String,
      skills: [String],           // e.g., ["React", "Node.js", "Python"]
      experience: Number,         // in years
      enrolledCourses: [{ courseId: ObjectId, progress: Number }],
      completedCourses: [ObjectId],
      assignedProjects: [{ projectId: ObjectId, progress: Number }],
      badges: [{ badgeId: ObjectId, dateEarned: Date }],
      role: { type: String, default: "employee" }  // or "admin"/"manager"
    }

    Profile Page (Frontend)

        Display user’s basic info (name, email, position, department).

        Show skill tags, years of experience.

        “Training Progress” card: list of enrolled courses with progress bar.

        “Projects” card: assigned projects with status & progress.

        “Badges Earned”: grid of badges with hover details.

Skill-Based Project Allocation

    Project Schema (Backend)

    {
      _id: ObjectId,
      title: String,
      description: String,
      requiredSkills: [String],      // e.g., ["React", "Node.js"]
      status: { type: String, enum: ["Pending","In Progress","Completed"], default: "Pending" },
      deadline: Date,
      assignedTo: ObjectId,          // userId
      progress: Number               // 0 – 100%
    }

    Admin Flow

        Create/edit projects: assign required skills, set deadlines.

        “Assign Project” view: filter employees by skills, assign a project with one click.

        Assigned projects appear on employee dashboards automatically.

    Employee Flow

        Projects list displays only those assigned to the logged-in user.

        Visual progress bar for each project inside “My Projects” page.

        When project is “Completed,” triggers badge allocation.

Stripe Payment & Badge Rewards

    Badge Schema (Backend)

    {
      _id: ObjectId,
      name: String,
      description: String,
      iconUrl: String,
      stripePriceId: String,  // Price ID in Stripe for bonus payout
      count: Number           // Number of that badge awarded globally
    }

    Flow

        Course/Project Completion

            On backend, when an employee completes a course or project, create a badge entry in User’s badges array and increment global badge count.

        Stripe Integration

            Each badge has an associated stripePriceId.

            Backend endpoint (/api/payments/award-badge) charges employer’s Stripe account for that badge’s bonus.

            On success, store Stripe payment details in a BadgeTransaction collection.

        Real-Time Updates

            After badge issuance, frontend realtime updates user’s badge count and analytics.

Performance Analytics

    Backend Data Aggregation

        Monthly training completions, project completions, badge counts.

        Endpoints:

            GET /api/analytics/training/monthly

            GET /api/analytics/projects/monthly

            GET /api/analytics/badges/monthly

    Frontend Visualization (React)

        PerformanceChart.jsx – line chart of completions over time.

        ProgressGraph.jsx – bar chart for badge distributions.

        Uses Chart.js (or Recharts) for interactive graphs.

        On the “Dashboard” page, display:

            “Your Personal Progress” (courses + projects)

            “Team Performance” (aggregate progress for all employees)

            “Badges Earned This Month”

Admin Dashboard

    AdminPanel.jsx

        Sections for Courses, Projects, Badge Allocation, and Analytics.

        Responsive tables with scroll on smaller screens.

        “Create Course” and “Create Project” modals.

        “Edit” buttons open the corresponding Edit modal.

        “Badge Allocation” displays badges and counts awarded.

        “AnalyticsDashboard.jsx” pulls aggregated data and shows charts/tables.

API Endpoints
Authentication (Clerk-managed)

    POST /api/auth/sync – Synchronize Clerk user with backend database.

Courses

    GET /api/courses – List all courses.

    GET /api/courses/:id – Get course details (including sections).

    POST /api/courses/enroll/:id – Enroll logged-in user in a course.

    PATCH /api/courses/:id/complete – Mark course complete, award badge.

    PATCH /api/courses/:id/sections/:sectionIdx – Toggle section completion & update progress.

Admin-Only

    GET /api/courses/admin – List all courses (admin view).

    POST /api/courses/admin – Create a new course.

    PUT /api/courses/admin/:id – Edit an existing course.

    DELETE /api/courses/admin/:id – Delete a course.

Projects

    GET /api/projects/my – List projects assigned to logged-in user.

    PATCH /api/projects/:id/complete – Mark project complete & award badge.

Admin-Only

    GET /api/projects/admin – List all projects.

    POST /api/projects/admin – Create a new project (with requiredSkills, deadline).

    PUT /api/projects/admin/:id – Edit an existing project.

    DELETE /api/projects/admin/:id – Delete a project.

    PATCH /api/projects/admin/:id/assign – Assign project to a user (body: { userId }).

Badges

    GET /api/admin/badges/allocations – Get badge allocation summary (counts, details).

    GET /api/badges/user – List badges earned by logged-in user.

Payments

    POST /api/payments/award-badge – Charge employer’s Stripe account and record badge transaction.

Analytics

    GET /api/analytics/training/monthly – Returns monthly course completions.

    GET /api/analytics/projects/monthly – Returns monthly project completions.

    GET /api/analytics/badges/monthly – Returns monthly badge distributions.

Deployment

    Backend (Render)

        Push the backend/ folder to a Git repository (e.g., GitHub).

        On Render, create a new Web Service:

            Connect to your repo’s backend branch.

            Set Build Command to npm install && npm run build (if you have a build step) or just npm install.

            Set Start Command to npm start.

            Configure environment variables exactly as in Environment Configuration → Backend.

            Render will automatically deploy and expose your API at a public URL (e.g., https://companygrow-backend.onrender.com).

    Frontend (Vercel)

        Push the frontend/ folder to a Git repository (e.g., the same repo’s frontend folder or a separate frontend repo).

        On Vercel, create a new Project and import from your Git provider.

        Set the root directory to frontend/ and configure the build command: npm run build, and the output directory: build.

        Under Settings → Environment Variables, add:

            REACT_APP_CLERK_PUBLISHABLE_KEY

            REACT_APP_BACKEND_URL (point to your Render backend URL)

        Vercel will automatically build and deploy the frontend.

Once both are deployed, your live URLs might be:

    Frontend: https://companygrow-frontend.vercel.app

    Backend API: https://companygrow-backend.onrender.com

Contributing

    Fork the repository.

    Create a new branch:

git checkout -b feature/your-feature-name

Install dependencies and implement your feature or fix.

Commit changes:

git add .
git commit -m "Add feature or fix description"

Push to your fork:

git push origin feature/your-feature-name

Open a Pull Request describing your changes and request a review.