# 💰 Expense Tracker - Full Stack Web Application

A professional expense tracking application built with React, Node.js, Express, and MySQL. Features user authentication, transaction management, and real-time financial summaries.

![Expense Tracker Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![React](https://img.shields.io/badge/React-18.x-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.x-orange)

## 🌟 Live Demo

- **Frontend (Vercel):** [https://expense-tracker-frontend.vercel.app](https://expense-tracker-frontend.vercel.app)
- **Backend API (Railway):** [https://expense-tracker-backend.up.railway.app](https://expense-tracker-backend.up.railway.app)
- **API Documentation:** [API Docs](#api-endpoints)

## 📋 Features

### 🔐 Authentication
- User registration with email validation
- Secure login with JWT tokens
- Password hashing with bcrypt
- Protected routes and API endpoints

### 💳 Transaction Management
- Add income and expense transactions
- Edit existing transactions
- Delete transactions
- View all transactions with filtering
- Real-time dashboard with summaries
- Transaction history with dates

### 📊 Dashboard
- Total income calculation
- Total expense calculation
- Balance calculation
- Visual transaction list
- Responsive design for all devices

### 🛡️ Security
- JWT token-based authentication
- Password hashing
- CORS protection
- SQL injection prevention
- Environment variable configuration

## 🏗️ Technology Stack

### Frontend
- **React.js** - UI library
- **Vite** - Build tool
- **Bootstrap 5** - CSS framework
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing
- **CORS** - Cross-origin resource sharing

### Deployment
- **Frontend:** Vercel
- **Backend:** Railway
- **Database:** Railway MySQL

## 📁 Project Structure
expense-tracker/
├── frontend/ # React frontend application
│ ├── public/ # Static assets
│ ├── src/
│ │ ├── components/ # React components
│ │ ├── services/ # API services
│ │ ├── App.jsx # Main app component
│ │ └── main.jsx # Entry point
│ ├── package.json
│ └── vite.config.js
│
├── backend/ # Node.js backend API
│ ├── config/ # Database configuration
│ ├── controllers/ # Route controllers
│ ├── middleware/ # Auth middleware
│ ├── routes/ # API routes
│ ├── .env.example # Environment template
│ ├── server.js # Main server file
│ └── package.json
│
├── database.sql # Database schema
├── .gitignore # Git ignore rules
└── README.md # This file