# HirePoint — Cloud-Native Job Portal Deployment

HirePoint is a full-stack MERN job portal deployed using a cloud-native Cloud & DevOps workflow.

The project demonstrates an end-to-end deployment process where a MERN application is containerized using Docker, validated through automated CI/CD with GitHub Actions, published to Docker Hub, deployed on Render, and continuously monitored using UptimeRobot.

---

##  Project Overview

HirePoint provides separate functionality for job seekers and recruiters.

###  Job Seeker Features

- User registration and login
- Browse available jobs
- Search and filter jobs
- View job details
- Apply for jobs
- Manage user profile
- Upload resume

###  Recruiter Features

- Recruiter registration and login
- Register companies
- Manage company information
- Create and manage job postings
- View applicants
- Manage recruiter profile

---

##  Technology Stack

### Application

- MongoDB
- Express.js
- React.js
- Node.js
- Redux Toolkit
- Axios
- JWT Authentication
- Cloudinary

### Cloud & DevOps

- Git
- GitHub
- Docker
- Docker Hub
- GitHub Actions
- Render
- UptimeRobot

---

##  Deployment Architecture

```text
                    ┌──────────────────────┐
                    │   MERN Application   │
                    │ React + Node.js      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │        Docker        │
                    │ Frontend + Backend   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    GitHub Actions    │
                    │     CI/CD Pipeline   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      Docker Hub      │
                    │   Container Images   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │        Render        │
                    │   Cloud Deployment   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     UptimeRobot      │
                    │      Monitoring      │
                    └──────────────────────┘
```

---

## Docker

The frontend and backend are containerized separately.

### Backend Docker Image

The backend is packaged into a Docker image using Node.js.

Build the backend image locally:

```bash
docker build -t hirepoint-backend ./backend
```

Run the backend container:

```bash
docker run -p 8000:8000 hirepoint-backend
```

The backend application runs on port `8000`.

### Frontend Docker Image

The frontend uses a multi-stage Docker build.

The first stage builds the React/Vite application and the final stage serves the production build using Nginx.

Build the frontend image:

```bash
docker build --build-arg VITE_API_URL=https://hirepoint-backend-ccs6.onrender.com -t hirepoint-frontend ./frontend
```

The frontend production container is served through Nginx.

---

##  Docker Hub

Docker Hub is used as the container image registry.

The GitHub Actions pipeline builds and pushes both application images.

### Backend Image

```text
aditiyadav30/hirepoint-backend:latest
```

### Frontend Image

```text
aditiyadav30/hirepoint-frontend:latest
```

Docker Hub provides a centralized location for the container images used in the deployment workflow.

---

##  Cloud Deployment

The application is deployed on Render using the Docker images produced by the CI/CD pipeline.

### Frontend

https://hirepoint-frontend.onrender.com

### Backend

https://hirepoint-backend-ccs6.onrender.com

### Backend Health Check

https://hirepoint-backend-ccs6.onrender.com/health

The GitHub Actions workflow triggers the Render deployment using a secure Render Deploy Hook.

This creates an automated flow from source-code changes to cloud deployment.

---

## Monitoring

UptimeRobot is used to continuously monitor the deployed application.

Monitoring helps detect:

- Service downtime
- Availability issues
- Unexpected outages

An email notification is configured to alert when the monitored service changes status.

---

##  Database

MongoDB is used as the application's database.

The backend communicates with MongoDB using Mongoose.

The database stores application data including:

- Users
- Companies
- Jobs
- Applications

---

##  Cloudinary

Cloudinary is used for cloud-based file and media storage.

It is used for uploaded application assets such as:

- Company logos
- User profile images
- Resume-related uploads

Using external cloud storage prevents uploaded files from depending on the local container filesystem.

---

##  Authentication

HirePoint uses JWT-based authentication.

Authentication tokens are stored using HTTP cookies and are sent with authenticated API requests.

The backend validates the JWT before allowing access to protected recruiter and user operations.

---

##  Rollback Strategy

A rollback procedure is documented separately in:

```text
ROLLBACK.md
```

The rollback process involves:

1. Identifying a previously known-good Git commit.
2. Reverting the problematic changes.
3. Running the CI/CD pipeline again.
4. Rebuilding the Docker images.
5. Publishing the updated images to Docker Hub.
6. Triggering a new Render deployment.
7. Verifying the deployed application.
8. Confirming that monitoring reports the service as healthy.

Previously published Docker images can also serve as known-good container versions.

---

##  Project Structure

```text
HirePoint-CloudDevopsProject/
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   ├── tests/
│   ├── Dockerfile
│   ├── package.json
│   └── index.js
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.js
│
├── ROLLBACK.md
├── .gitignore
└── README.md
```

---

##  Local Development

### Prerequisites

Install the following:

- Node.js 20+
- npm
- Git
- Docker
- MongoDB

### Clone the Repository

```bash
git clone https://github.com/Aditi1879/HirePoint-CloudDevopsProject.git

cd HirePoint-CloudDevopsProject
```

### Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` directory and configure the required environment variables.

Start the backend:

```bash
npm start
```

The backend runs on:

```text
http://localhost:8000
```

### Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will be available through the Vite development server.

The frontend API configuration should point to the appropriate backend environment.

---

##  Running with Docker

### Build Backend

From the project root:

```bash
docker build -t hirepoint-backend ./backend
```

### Run Backend

```bash
docker run -p 8000:8000 hirepoint-backend
```

### Build Frontend

```bash
docker build --build-arg VITE_API_URL=https://hirepoint-backend-ccs6.onrender.com -t hirepoint-frontend ./frontend
```

The frontend image uses Nginx to serve the production build.

---

##  CI/CD Pipeline

The GitHub Actions workflow is triggered when changes are pushed to the `main` branch or when a pull request targets the `main` branch.

### Pipeline Stages

```text
Code Push
    ↓
Checkout Repository
    ↓
Setup Node.js 20
    ↓
Install Backend Dependencies
    ↓
Run Backend Tests
    ↓
Install Frontend Dependencies
    ↓
Run Frontend Lint
    ↓
Build Frontend
    ↓
Build Backend Docker Image
    ↓
Build Frontend Docker Image
    ↓
Login to Docker Hub
    ↓
Push Docker Images
    ↓
Trigger Render Deployment
```

The pipeline automatically validates the application before publishing the Docker images and triggering deployment.

---

##  Automated Testing & Quality Checks

### Backend

The CI pipeline installs backend dependencies and runs automated tests:

```bash
npm ci
npm test
```

Backend tests are executed as part of the CI pipeline.

### Frontend

The CI pipeline performs:

```bash
npm ci
npm run lint
npm run build
```

This ensures that the frontend passes linting and that the production build completes successfully.

---

##  GitHub Actions Workflow

The CI/CD workflow is defined in:

```text
.github/workflows/ci-cd.yml
```

The workflow:

- Checks out the repository
- Sets up Node.js 20
- Installs backend dependencies
- Runs backend tests
- Installs frontend dependencies
- Runs frontend linting
- Builds the frontend
- Builds the backend Docker image
- Builds the frontend Docker image
- Authenticates with Docker Hub
- Tags Docker images
- Pushes Docker images to Docker Hub
- Triggers Render deployment

This provides an automated path from source code changes to cloud deployment.

---

##  Environment Variables & Secrets

Sensitive credentials are not stored directly in the repository.

GitHub Actions uses encrypted repository secrets for CI/CD operations.

### GitHub Actions Secrets

```text
DOCKERHUB_USERNAME
DOCKERHUB_TOKEN
RENDER_DEPLOY_HOOK
```

Application secrets such as database credentials, JWT secrets, and Cloudinary credentials are configured through the deployment environment rather than committed to the repository.

---

##  DevOps Implementation

| Practice | Implementation |
|---|---|
| Version Control | Git + GitHub |
| Application | MERN Stack |
| Containerization | Docker |
| CI/CD | GitHub Actions |
| Automated Testing | Backend Tests |
| Code Quality | ESLint |
| Container Registry | Docker Hub |
| Cloud Deployment | Render |
| Monitoring | UptimeRobot |
| Authentication | JWT + HTTP Cookies |
| Database | MongoDB |
| External File Storage | Cloudinary |
| Rollback | Git + Docker Image Strategy |

---

##  Project Objective

The objective of HirePoint is to demonstrate an end-to-end Cloud and DevOps deployment workflow for a full-stack MERN application.

The application follows this lifecycle:

```text
Develop
   ↓
Test & Validate
   ↓
Containerize
   ↓
Automate
   ↓
Publish
   ↓
Deploy
   ↓
Monitor
```

The project demonstrates how development practices, containerization, CI/CD automation, cloud deployment, and monitoring can be integrated into a single deployment workflow.

---

##  Deployment URLs

### Frontend

https://hirepoint-frontend.onrender.com

### Backend

https://hirepoint-backend-ccs6.onrender.com

---

##  Author

**Aditi Yadav**

MCA Student  
Cloud & DevOps Enthusiast
