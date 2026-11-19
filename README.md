# HirePoint — MERN Job Portal | AWS Cloud & DevOps Deployment

HirePoint is a full-stack MERN job portal that connects job seekers with recruiters. The project combines application development with a practical Cloud and DevOps implementation, including Docker-based workflows, automated CI/CD, AWS deployment, secure file storage, monitoring, and HTTPS.

The repository demonstrates two deployment workflows:

1. **AWS deployment:** GitHub source → AWS CodePipeline → AWS CodeBuild → AWS CodeDeploy → Amazon EC2.
2. **Container-based workflow:** GitHub Actions validates the application, builds and publishes Docker images to Docker Hub, and triggers the configured Render deployment.

The AWS-hosted application is available at **https://appfoundry.online**.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Application Features](#application-features)
- [Technology Stack](#technology-stack)
- [Architecture Overview](#architecture-overview)
- [AWS Services Implemented](#aws-services-implemented)
- [AWS Deployment Workflow](#aws-deployment-workflow)
- [EC2 Hosting, Nginx and PM2](#ec2-hosting-nginx-and-pm2)
- [File and Media Storage](#file-and-media-storage)
- [Domain, DNS and HTTPS](#domain-dns-and-https)
- [Docker and Docker Hub](#docker-and-docker-hub)
- [GitHub Actions CI/CD](#github-actions-cicd)
- [Render Deployment Workflow](#render-deployment-workflow)
- [Monitoring and Notifications](#monitoring-and-notifications)
- [Database and Authentication](#database-and-authentication)
- [Security Practices](#security-practices)
- [Testing and Validation](#testing-and-validation)
- [Rollback and Recovery](#rollback-and-recovery)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [Running with Docker](#running-with-docker)
- [Environment Variables and Secrets](#environment-variables-and-secrets)
- [Deployment URLs](#deployment-urls)
- [Project Objective and Outcomes](#project-objective-and-outcomes)
- [Author](#author)

---

## Project Overview

HirePoint provides separate functionality for job seekers and recruiters. It demonstrates how a full-stack application can be developed, containerized, validated, deployed to cloud infrastructure, and monitored after release.

### Job Seeker Features

- User registration and login
- Browse available jobs
- Search and filter jobs
- View job details
- Apply for jobs
- Manage user profile
- Upload resumes

### Recruiter Features

- Recruiter registration and login
- Register companies
- Manage company information
- Create and manage job postings
- View applicants
- Manage recruiter profile

---

## Application Features

The frontend is built with React and communicates with a Node.js/Express backend through API requests. The backend applies application logic, validates protected operations, and works with the database and file-storage services.

The application includes role-specific user and recruiter functionality, JWT-based authentication, job and company management, application handling, profile management, and file uploads.

---

## Technology Stack

### MERN Application

| Technology | Purpose |
|---|---|
| MongoDB Atlas | Cloud-hosted application database |
| Express.js | Backend API framework |
| React.js | Frontend user interface |
| Node.js | Backend JavaScript runtime |
| Redux Toolkit | Frontend state management |
| Axios | HTTP communication between frontend and backend |
| Mongoose | MongoDB object modelling and database operations |
| JWT + HTTP cookies | Authentication and protected API access |

### AWS Cloud Services

| AWS service | How it is used in HirePoint |
|---|---|
| **Amazon EC2** | Hosts the application on an Amazon Linux instance. Nginx serves the frontend and PM2 manages the backend process. |
| **Amazon S3** | Stores uploaded resumes in the private `hirepoint-resumes` bucket with server-side encryption. |
| **AWS Lambda** | The `HirePoint-ResumeUploadAudit` function processes S3 resume-upload events and generates audit logs. |
| **Amazon CloudWatch** | Monitors EC2 CPU and disk usage and provides alarms for high resource utilization. |
| **Amazon SNS** | The `HirePoint-CloudWatch-Alerts` topic distributes CloudWatch alarm notifications through a confirmed subscription. |
| **AWS IAM** | Roles and policies provide permissions for AWS services and deployment operations. |
| **AWS CodePipeline** | Orchestrates the AWS CI/CD workflow from the GitHub source through build and deployment. |
| **AWS CodeBuild** | Builds the application and executes the configured Docker-based build workflow. |
| **AWS CodeDeploy** | Automates application deployment from the pipeline to the EC2 instance. |

### Other Cloud and DevOps Technologies

| Technology / Platform | Purpose |
|---|---|
| Git and GitHub | Source-code management and version control |
| Docker | Application containerization |
| Docker Hub | Container image registry |
| GitHub Actions | Automated validation, build and image-publishing workflow |
| Render | Additional deployment target used by the Docker/GitHub Actions workflow |
| Nginx | Web server and reverse proxy on EC2; also used in the frontend container |
| PM2 | Node.js backend process management on EC2 |
| Hostinger | Domain registration and DNS management for `appfoundry.online` |
| Certbot / Let's Encrypt | TLS certificate provisioning and automatic renewal |
| Cloudinary | Image and media storage, such as company logos and profile images |
| UptimeRobot | External website availability monitoring |

---

## Architecture Overview

### AWS Deployment Architecture

```text
                         GitHub Repository
                           main branch
                                |
                                v
                         AWS CodePipeline
                                |
                                v
                          AWS CodeBuild
                    Build / Docker-based workflow
                                |
                                v
                          AWS CodeDeploy
                                |
                                v
                      Amazon EC2 (Amazon Linux)
                         /              \
                        v                v
                 Nginx Web Server     PM2 Process Manager
                 Frontend assets     Node.js / Express API
                        \                /
                         \              /
                          HirePoint Application
                                |
             +------------------+-------------------+
             |                  |                   |
             v                  v                   v
       MongoDB Atlas       Amazon S3             Cloudinary
       Application data    Private resumes       Image/media assets
                                |
                                v
                       S3 Object-Create Event
                                |
                                v
                     AWS Lambda: ResumeUploadAudit
                                |
                                v
                         Audit log generation

     EC2 metrics → CloudWatch alarms → SNS topic → Confirmed subscription
```

### Container and GitHub Actions Workflow

```text
Developer Push / Pull Request
             |
             v
        GitHub Actions
             |
             +--> Install dependencies
             +--> Backend tests
             +--> Frontend lint and build
             +--> Build backend Docker image
             +--> Build frontend Docker image
             |
             v
       Docker Hub Registry
             |
             v
      Render Deploy Hook
             |
             v
      Render Deployment
             |
             v
        UptimeRobot
```

The AWS CodePipeline and GitHub Actions workflows are separate automation paths. The AWS pipeline deploys to EC2 through CodeDeploy; the GitHub Actions workflow publishes Docker images and triggers the configured Render deployment.

---

## AWS Services Implemented

This section summarizes the nine AWS services implemented in the project.

### 1. Amazon EC2 — Application Hosting

- Hosts the HirePoint application on an Amazon Linux EC2 instance.
- Nginx serves the frontend production files and acts as the reverse proxy for backend API requests.
- PM2 manages the Node.js backend process.
- The instance is deployed in the AWS Mumbai region (`ap-south-1`).

### 2. Amazon S3 — Resume Storage

- Uploaded resumes are stored in the `hirepoint-resumes` S3 bucket.
- The bucket uses private access rather than public object access.
- Server-side encryption is enabled to protect stored resume files.
- S3 object-upload events are used to invoke the resume audit Lambda function.

### 3. AWS Lambda — Resume Upload Audit

- Lambda function: `HirePoint-ResumeUploadAudit`.
- Processes S3 resume-upload events.
- Generates audit log entries associated with resume uploads.
- Demonstrates event-driven, serverless processing alongside the main application hosted on EC2.

### 4. Amazon CloudWatch — Resource Monitoring

- Monitors EC2 resource utilization, including CPU and disk usage.
- CloudWatch alarms are configured to detect high resource utilization.
- Alarm state changes are used to initiate notification delivery through SNS.

### 5. Amazon SNS — Alarm Notifications

- SNS topic: `HirePoint-CloudWatch-Alerts`.
- Receives notification actions from CloudWatch alarms.
- Delivers alarm notifications through a confirmed subscription.
- Provides a notification path for operational alerts.

### 6. AWS IAM — Access Management

- IAM roles and policies grant permissions to the AWS services involved in the project.
- Service-to-service access is configured through IAM rather than embedding AWS credentials in application source code.
- Permissions support the pipeline, build, deployment, EC2 and event-processing workflows.

### 7. AWS CodePipeline — CI/CD Orchestration

- Connects the GitHub source repository to the AWS build and deployment stages.
- Starts the pipeline when changes are detected on the configured source branch.
- Coordinates CodeBuild and CodeDeploy to deliver application changes to EC2.

### 8. AWS CodeBuild — Build Automation

- Receives the source artifact from CodePipeline.
- Executes the configured build instructions.
- Builds the application and runs the Docker-based build workflow configured for the project.
- Provides build logs for troubleshooting and verification.

### 9. AWS CodeDeploy — EC2 Deployment

- Receives the deployment artifact from the pipeline.
- Automates deployment to the EC2 instance.
- Uses the configured deployment instructions and lifecycle actions to update the application on the instance.
- Provides deployment status and lifecycle logs for release verification.

---

## AWS Deployment Workflow

The AWS delivery path is:

```text
GitHub Push to main
        |
        v
AWS CodePipeline — Source Stage
        |
        v
AWS CodeBuild — Build Stage
        |
        v
Pipeline Deployment Artifact
        |
        v
AWS CodeDeploy — Deploy Stage
        |
        v
Amazon EC2 — Application Updated
        |
        v
Verify website, API, logs and monitoring
```

### Pipeline Stages

1. **Source:** CodePipeline retrieves the configured source from GitHub.
2. **Build:** CodeBuild executes the project's build instructions and produces the required output artifact.
3. **Deploy:** CodeDeploy delivers the artifact to the EC2 instance using the configured deployment specification and lifecycle actions.
4. **Verify:** The deployed website, backend process, Nginx configuration, deployment logs and monitoring status are checked.

The pipeline separates source retrieval, build execution and server deployment into distinct stages, making the release process easier to inspect and troubleshoot.

---

## EC2 Hosting, Nginx and PM2

The AWS-hosted application runs on an Amazon Linux EC2 instance.

### Nginx

- Receives incoming web traffic for the HirePoint domain.
- Serves the built React frontend as static files.
- Proxies backend API requests to the Node.js/Express application according to the Nginx configuration.

### PM2

- Runs and supervises the Node.js backend process.
- Helps keep the backend process running and supports process restarts.
- Provides process status and application logs for operational checks.

The backend uses port `8000` in the local development configuration. The public application is accessed through the domain and Nginx rather than by exposing the backend development port directly.

---

## File and Media Storage

HirePoint uses separate storage services for different asset types.

### Amazon S3 — Resumes

- S3 bucket: `hirepoint-resumes`.
- Stores uploaded resume files.
- Configured for private access and server-side encryption.
- S3 upload events trigger the `HirePoint-ResumeUploadAudit` Lambda function.

### Cloudinary — Images and Media

Cloudinary is used for application image and media assets such as:

- Company logos
- User profile images

Separating resume storage from image/media storage provides a clear storage responsibility for each asset category.

---

## Domain, DNS and HTTPS

- Application domain: **appfoundry.online**.
- DNS is managed through Hostinger, with the root domain and `www` hostname configured to resolve to the AWS-hosted application.
- Nginx is configured to serve the application for the intended hostnames.
- Certbot obtains and configures the TLS certificate from Let's Encrypt.
- The Certbot renewal timer is configured for automatic certificate renewal.
- A `certbot renew --dry-run` check is used to test the renewal process.

HTTPS encrypts traffic between the user's browser and the application server.

---

## Docker and Docker Hub

The frontend and backend are containerized separately.

### Backend Docker Image

The backend is packaged into a Docker image using Node.js.

Build the backend image from the repository root:

```bash
docker build -t hirepoint-backend ./backend
```

Run the backend container:

```bash
docker run -p 8000:8000 hirepoint-backend
```

### Frontend Docker Image

The frontend uses a multi-stage Docker build. The build stage creates the React/Vite production assets, and the final image serves the output using Nginx.

Build the frontend image, replacing the API URL with the backend endpoint intended for that deployment:

```bash
docker build \
  --build-arg VITE_API_URL=https://hirepoint-backend-ccs6.onrender.com \
  -t hirepoint-frontend ./frontend
```

### Docker Hub Images

The GitHub Actions workflow publishes the application images to Docker Hub:

**Backend**

```text
aditiyadav30/hirepoint-backend:latest
```

**Frontend**

```text
aditiyadav30/hirepoint-frontend:latest
```

Docker Hub provides a centralized registry for the container images produced by the GitHub Actions workflow.

---

## GitHub Actions CI/CD

The GitHub Actions workflow is defined in:

```text
.github/workflows/ci-cd.yml
```

The workflow is configured to run when changes are pushed to the `main` branch or when a pull request targets `main`.

### Workflow Stages

```text
Code Push / Pull Request
          |
          v
   Checkout Repository
          |
          v
   Setup Node.js 20
          |
          v
 Install Backend Dependencies
          |
          v
     Run Backend Tests
          |
          v
 Install Frontend Dependencies
          |
          v
     Run Frontend Lint
          |
          v
      Build Frontend
          |
          v
 Build Backend Docker Image
          |
          v
 Build Frontend Docker Image
          |
          v
      Login to Docker Hub
          |
          v
    Push Docker Images
          |
          v
  Trigger Render Deployment
```

### Automated Quality Checks

**Backend**

```bash
npm ci
npm test
```

**Frontend**

```bash
npm ci
npm run lint
npm run build
```

These checks help identify backend test failures, frontend lint issues and build errors before the container images are published.

---

## Render Deployment Workflow

In addition to the AWS EC2 deployment, the repository's Docker/GitHub Actions workflow includes a Render deployment target.

- The frontend and backend Docker images are built by GitHub Actions and published to Docker Hub.
- The GitHub Actions workflow triggers the configured Render Deploy Hook.
- Render runs the configured frontend and backend services.
- UptimeRobot monitors the configured public endpoint for availability.

This is a separate deployment path from the AWS CodePipeline → CodeBuild → CodeDeploy → EC2 workflow.

---

## Monitoring and Notifications

HirePoint uses AWS monitoring and an external uptime-monitoring service.

### Amazon CloudWatch

- Monitors EC2 CPU and disk usage.
- Configured alarms detect high resource utilization.
- Alarm actions send notifications to the `HirePoint-CloudWatch-Alerts` SNS topic.

### Amazon SNS

- Distributes CloudWatch alarm notifications through a confirmed subscription.
- Provides an alerting path for infrastructure events.

### UptimeRobot

UptimeRobot monitors the configured public application endpoint to help detect:

- Service downtime
- Availability issues
- Unexpected outages

An email notification is configured for monitored service status changes.

---

## Database and Authentication

### Database

MongoDB Atlas is used as the application's managed database. The backend communicates with MongoDB using Mongoose.

The database stores application records including:

- Users
- Companies
- Jobs
- Applications

Resume files are stored in the private S3 bucket, while image/media assets such as company logos and profile images are handled by Cloudinary.

### Authentication

- HirePoint uses JWT-based authentication.
- Authentication tokens are stored using HTTP cookies and are sent with authenticated API requests.
- The backend validates JWTs before allowing access to protected user and recruiter operations.
- Cookie and security configuration is set for the deployed environment so authenticated requests work with the application's HTTPS setup.

---

## Security Practices

- S3 resume objects are stored in a private bucket with server-side encryption.
- AWS service access is managed with IAM roles and policies.
- Application credentials and tokens are not committed to the source repository.
- GitHub Actions credentials are stored as encrypted repository secrets.
- HTTPS is enabled for the public AWS-hosted application using Certbot and Let's Encrypt.
- EC2 security group rules should expose only the ports required by the application and administration workflow.

---

## Testing and Validation

The project is validated at application, pipeline and infrastructure levels.

### Application Validation

- Verify student registration and login.
- Verify recruiter registration and login.
- Test job browsing, search/filtering and job details.
- Test job application submission.
- Test recruiter company and job-management functions.
- Verify profile and file-upload workflows.

### CI/CD Validation

- Review GitHub Actions workflow results and logs.
- Review CodePipeline execution status.
- Review CodeBuild logs and build output.
- Review CodeDeploy deployment status and lifecycle events.

### Server and Cloud Validation

- Check the backend process using PM2.
- Check Nginx service status and configuration.
- Verify DNS resolution for `appfoundry.online` and `www.appfoundry.online`.
- Confirm HTTPS certificate validity.
- Test Certbot renewal using a dry run.
- Review CloudWatch metrics and alarm status.
- Verify SNS notification delivery through the confirmed subscription.
- Confirm that UptimeRobot reports the monitored endpoint as available.

---

## Rollback and Recovery

A rollback procedure is documented separately in:

```text
ROLLBACK.md
```

The recovery approach includes:

1. Identify a previously known-good Git commit or Docker image version.
2. Revert the problematic source changes when required.
3. Run the relevant CI/CD workflow again.
4. Rebuild and publish the Docker images for the GitHub Actions / Render path, when applicable.
5. Run or verify the AWS CodePipeline deployment for the EC2 path, when applicable.
6. Verify the application, backend process, domain, HTTPS and monitoring status after recovery.

Previously published Docker images can also serve as known-good container versions for the container-based workflow.

---

## Project Structure

The main application structure is organized as follows. Deployment configuration files and scripts used by the AWS pipeline are maintained alongside the application source in the repository.

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
├── buildspec.yml
├── .gitignore
└── README.md
```

> The exact deployment specification and lifecycle-script filenames depend on the current CodeDeploy configuration in the repository.

---

## Local Development

### Prerequisites

Install the following:

- Node.js 20+
- npm
- Git
- Docker (for container workflows)
- MongoDB Atlas account or a local MongoDB instance

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

Create a `.env` file inside the `backend` directory and configure the environment variables required by the application. Do not commit this file.

Start the backend:

```bash
npm start
```

The backend runs locally on:

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

Configure the frontend API base URL for the backend environment being used.

---

## Running with Docker

Run these commands from the repository root.

### Build Backend

```bash
docker build -t hirepoint-backend ./backend
```

### Run Backend

```bash
docker run -p 8000:8000 hirepoint-backend
```

### Build Frontend

Replace `https://hirepoint-backend-ccs6.onrender.com` with the URL for the backend environment you want the frontend to use:

```bash
docker build \
  --build-arg VITE_API_URL=https://hirepoint-backend-ccs6.onrender.com \
  -t hirepoint-frontend ./frontend
```

The frontend production image uses Nginx to serve the built React application.

---

## Environment Variables and Secrets

Sensitive credentials must not be stored directly in the repository.

### GitHub Actions Secrets

The existing Docker Hub / Render workflow uses the following repository secrets:

```text
DOCKERHUB_USERNAME
DOCKERHUB_TOKEN
RENDER_DEPLOY_HOOK
```

Application environment values, such as database connection details, JWT secrets and Cloudinary credentials, must be configured in the relevant deployment environment rather than committed to source control.

AWS service permissions are managed through IAM roles and policies. Do not place AWS access keys or other cloud credentials in application source files.

---

## Deployment URLs

### AWS-hosted Application

- **Main domain:** [https://appfoundry.online](https://appfoundry.online)
- **WWW domain:** [https://www.appfoundry.online](https://www.appfoundry.online)

### Render Deployment Endpoints

The existing Render deployment endpoints are:

- **Frontend:** [https://hirepoint-frontend.onrender.com](https://hirepoint-frontend.onrender.com)
- **Backend:** [https://hirepoint-backend-ccs6.onrender.com](https://hirepoint-backend-ccs6.onrender.com)
- **Backend health check:** [https://hirepoint-backend-ccs6.onrender.com/health](https://hirepoint-backend-ccs6.onrender.com/health)

---

## DevOps Implementation Summary

| Practice | Implementation |
|---|---|
| Version control | Git + GitHub |
| Application | MERN stack |
| Database | MongoDB Atlas |
| Containerization | Docker |
| Container registry | Docker Hub |
| CI validation and image publishing | GitHub Actions |
| AWS CI/CD orchestration | AWS CodePipeline |
| AWS build automation | AWS CodeBuild |
| AWS application deployment | AWS CodeDeploy |
| Cloud compute | Amazon EC2 |
| Resume object storage | Amazon S3 |
| Event-driven processing | AWS Lambda |
| Infrastructure monitoring | Amazon CloudWatch |
| Alarm notifications | Amazon SNS |
| Access management | AWS IAM |
| Web server / reverse proxy | Nginx |
| Backend process management | PM2 |
| Domain and DNS | Hostinger |
| HTTPS certificates | Certbot + Let's Encrypt |
| Image and media storage | Cloudinary |
| External uptime monitoring | UptimeRobot |
| Additional container deployment target | Render |
| Recovery approach | Git history and known-good Docker image versions |

---

## Project Objective and Outcomes

The objective of HirePoint is to demonstrate how a full-stack MERN application can be developed and operated using modern Cloud and DevOps practices.

The project lifecycle includes:

```text
Develop
   ↓
Version Control
   ↓
Test and Validate
   ↓
Build and Containerize
   ↓
Publish Artifacts / Images
   ↓
Deploy to Cloud Infrastructure
   ↓
Secure with HTTPS and Access Controls
   ↓
Monitor and Notify
```

The project brings together application development, Docker, GitHub Actions, AWS CI/CD services, EC2 hosting, S3-based resume storage, Lambda event processing, CloudWatch monitoring, SNS notifications, domain configuration and HTTPS.

---

## Author

**Aditi Yadav**
MCA Student
Cloud & DevOps Enthusiast
