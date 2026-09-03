# RateHub — Store Rating Platform

RateHub is a full-stack web application. It allows users to discover stores, submit ratings, and manage their accounts, with dedicated functionality for store owners and administrators.

## Features

### User Features

* User registration and login
* JWT-based authentication
* Browse available stores
* View store details and ratings
* Submit and manage ratings
* Protected user dashboard

### Store Owner Features

* Owner dashboard
* Manage store-related information
* View ratings and store performance

### Admin Features

* Admin dashboard
* Manage users
* Manage stores
* View and manage ratings

## Tech Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Vite

### Backend

* Node.js
* Express.js
* MySQL
* MySQL2
* JWT
* bcrypt / bcryptjs
* dotenv
* CORS

### Database

* MySQL

## Project Structure

```text
RateHub/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── ProtectedRoute.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .gitignore
│
├── .gitignore
└── README.md
```

## Backend API Structure

The backend provides API routes for:

```text
/api
/api/auth
/api/stores
/api/ratings
/api/admin
```

The backend is built using Express.js and connects to a MySQL database using the `mysql2` package.

## Environment Variables

The backend requires database configuration through environment variables.

Create a `.env` file inside the `server` directory:

```env
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
DB_PORT=your_database_port
PORT=5000
```

> **Security:** Never commit the `.env` file to GitHub. Database credentials and other secrets should remain private.

The project's `server/.gitignore` already excludes `.env` and `node_modules`.

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/RoshniN0831/RateHub-Coding-Challenge.git
cd RateHub-Coding-Challenge
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

### 3. Install Backend Dependencies

Open another terminal and run:

```bash
cd server
npm install
```

### 4. Configure MySQL

Make sure MySQL is installed and running.

Create/configure the required RateHub database and update the database credentials in:

```text
server/.env
```

using the following variables:

```text
DB_HOST
DB_USER
DB_PASSWORD
DB_NAME
DB_PORT
```

## Running the Application

### Start the Backend

From the `server` directory:

```bash
node server.js
```

The backend runs on:

```text
http://localhost:5000
```

### Start the Frontend

From the `client` directory:

```bash
npm run dev
```

Vite will provide the local frontend URL in the terminal, normally:

```text
http://localhost:5173
```

## Authentication

RateHub uses:

* JWT for authentication and protected routes
* bcrypt/bcryptjs for password hashing
* Protected frontend routes for authenticated users

Different user roles provide access to their respective dashboards and functionality.

## Security

The project follows basic application security practices including:

* Password hashing
* JWT-based authentication
* Protected routes
* Environment variables for database credentials
* CORS configuration
* Exclusion of `.env` and `node_modules` from version control

## Main Application Sections

The frontend includes pages for:

* Landing Page
* Login
* Signup
* Stores
* Store Details
* User Dashboard
* Owner Dashboard
* Admin Dashboard
* Admin Users
* Admin Stores
* Admin Ratings

## Development

This project was developed as a full-stack coding challenge demonstrating:

* Frontend development with React
* REST API development with Express.js
* MySQL database integration
* Authentication and authorization
* Role-based access control
* CRUD-based application functionality
* Responsive user interface development

## Repository

GitHub Repository:

**RateHub-Coding-Challenge**

Developed as part of the **Roxiler Campus Process-Coding Challenge**.
