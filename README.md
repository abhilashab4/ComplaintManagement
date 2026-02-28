# Hostel Complaint Management System

A containerized full-stack web application deployed on AWS EC2 using Docker. The system integrates AWS SNS, AWS Lambda, and Amazon CloudWatch to implement an event-driven architecture for complaint notifications.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [🚀 Deployment Environment](#-deployment-environment)
- [🐳 Container Architecture](#-container-architecture)
  - [1️⃣ Frontend Container](#1-frontend-container)
  - [2️⃣ Backend Container](#2-backend-container)
- [▶️ Running the Application](#-running-the-application)
- [🌐 Port Mapping](#-port-mapping)
- [🌍 Application Access](#-application-access)
- [🏗 Architecture Overview](#-architecture-overview)
- [🔐 Networking & Security](#-networking--security)
  - [EC2 Security Group](#ec2-security-group)
- [☁ Serverful vs Serverless Architecture](#serverful-vs-serverless-architecture)
  - [Serverful (EC2)](#serverful-ec2)
  - [Serverless (AWS Lambda)](#serverless-aws-lambda)
- [Conclusion](#conclusion)

---

## Project Overview

The Hostel Complaint Management System allows:

- Students to submit complaints
- Wardens to manage and track complaints

The application follows a containerized microservice architecture deployed on an AWS EC2 instance.

## Tech Stack

- **Frontend:** React + Nginx
- **Backend:** Node.js + Express
- **Containerization:** Docker & Docker Compose
- **Cloud Provider:** AWS
- **Compute:** EC2
- **Messaging:** AWS SNS
- **Serverless Processing:** AWS Lambda
- **Monitoring & Logs:** Amazon CloudWatch

---

## 🚀 Deployment Environment

- AWS EC2 Instance (Ubuntu)
- Docker & Docker Compose installed
- Security Group configured for:
  - Port 22 (SSH)
  - Port 80 (HTTP)

---

## 🐳 Container Architecture

The system runs two Docker containers:

### 1️⃣ Frontend Container

- Built using React
- Served using Nginx
- Runs on Port 80
- Acts as a Reverse Proxy
- Forwards `/api` requests to backend

### 2️⃣ Backend Container

- Built using Node.js (Express)
- Runs on Port 5000
- Handles:
  - Authentication
  - Complaint management
  - User management
- Publishes complaint events to AWS SNS
- Not publicly exposed

---

## ▶️ Running the Application

Start the application using:

```bash
docker-compose up --build -d
```

To verify running containers:

```bash
docker ps
```

---

## 🌐 Port Mapping

| Service   | Internal Port | External Port      |
|-----------|---------------|---------------------|
| Frontend  | 80            | 80                  |
| Backend   | 5000          | Not Exposed         |

**Important:**

- Only Port 80 is exposed publicly.
- Backend Port 5000 is accessible only inside the Docker network.
- Nginx acts as a reverse proxy.

---

## 🌍 Application Access

Access the application at:  
`http://<EC2-Public-IP>`

---

## 🏗 Architecture Overview

```
User → Nginx → Backend → SNS → Lambda → CloudWatch → User
```

---

## 🔐 Networking & Security

### EC2 Security Group

| Port | Purpose        |
|------|---------------|
| 22   | SSH Access    |
| 80   | HTTP Access   |
| 5000 | Not Exposed   |

---

## ☁ Serverful vs Serverless Architecture

### Serverful (EC2)

- Requires server management
- Runs continuously
- Billed per hour
- Hosts frontend and backend containers

### Serverless (AWS Lambda)

- No server management
- Executes only when triggered
- Automatically scales
- Billed per execution
- Triggered by SNS events

---

## Conclusion

This project demonstrates:

- Docker-based containerization
- Reverse proxy architecture using Nginx
- Secure backend isolation
- Event-driven design using AWS SNS
- Serverless processing using AWS Lambda
- Logging and monitoring with CloudWatch
- Hybrid Serverful + Serverless cloud architecture
