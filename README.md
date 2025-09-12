# Mock Social Media Application

A comprehensive social media application built for our Databases Classes to demonstrate and showcase various SQL queries, database operations, and full-stack development practices.

## 🎯 Project Overview

This project is a mock social media platform that includes user authentication, post creation, likes, shares, and user interactions. It serves as a practical demonstration of database design, SQL query optimization, and modern web development technologies.

## 🛠️ Technology Stack

- **Frontend**: React.js with Chakra UI
- **Backend**: Express.js (Node.js)
- **Database**: MySQL/MariaDB
- **Authentication**: Express Sessions
- **HTTP Client**: Axios

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

### 1. Node.js
Download and install Node.js from [nodejs.org](https://nodejs.org/)
- Recommended version: 16.x or higher
- Verify installation: `node --version` and `npm --version`

### 2. MySQL/MariaDB
Choose one of the following options:

#### Option A: MySQL
1. Download MySQL from [mysql.com](https://dev.mysql.com/downloads/)
2. Follow the installation wizard
3. Remember your root password

#### Option B: MariaDB (Alternative)
1. Download MariaDB from [mariadb.org](https://mariadb.org/download/)
2. Follow the installation instructions for your OS

#### Option C: Using Homebrew (macOS)
```bash
# For MySQL
brew install mysql
brew services start mysql

# For MariaDB
brew install mariadb
brew services start mariadb
```

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd proj421-main
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Environment Configuration
Create a `.env` file in the `backend` directory with the following variables:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=proj421
SESSION_SECRET=dev-secret-key-421
```

**Important**: Replace `your_mysql_password` with your actual MySQL root password.

### 5. Database Setup
Run the database setup script to create tables and populate with mock data:

```bash
cd backend
npm run setup
```

This will:
- Create the `proj421` database
- Set up all required tables
- Insert initial data and mock data
- Create stored procedures and triggers

## 🏃‍♂️ Running the Application

### Start the Backend Server
```bash
cd backend
npm start
# Or for development with auto-reload:
npm run dev
```
The backend will run on `http://localhost:3000`

### Start the Frontend Application
```bash
cd frontend
npm start
```
The frontend will run on `http://localhost:3001`

## 📁 Project Structure

```
proj421-main/
├── backend/
│   ├── src/
│   │   ├── database/         # Database setup and queries
│   │   ├── db_ops/          # Database operations
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Authentication middleware
│   │   └── config/          # Database configuration
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── pages/           # React components/pages
│   │   └── ...
│   └── package.json
└── README.md
```

## 🗄️ Database Features

This application demonstrates various database concepts:

- **User Management**: User registration, authentication, and profiles
- **Posts**: Create, read, update, delete operations
- **Social Interactions**: Likes, shares, and user statistics
- **Stored Procedures**: For complex queries and user statistics
- **Triggers**: Automated database operations
- **Relationships**: Foreign keys and table relationships

## 🔧 Available Scripts

### Backend Scripts
- `npm start` - Start the production server
- `npm run dev` - Start with nodemon for development
- `npm run setup` - Initialize database with tables and mock data

### Frontend Scripts
- `npm start` - Start the development server
- `npm run build` - Build for production
- `npm test` - Run tests

## 🐳 Docker Support

For containerized deployment, use the provided Dockerfile:

```bash
# Build the Docker image
docker build -t social-media-app .

# Run the container
docker run -p 3000:3000 -p 3306:3306 social-media-app
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify MySQL/MariaDB is running
   - Check credentials in `.env` file
   - Ensure database user has proper permissions

2. **Port Already in Use**
   - Change ports in the application if 3000/3001 are occupied
   - Kill processes using the ports: `lsof -ti:3000 | xargs kill`

3. **Module Not Found**
   - Run `npm install` in both backend and frontend directories
   - Clear npm cache: `npm cache clean --force`

## 📚 Learning Objectives

This project demonstrates:
- Database design and normalization
- SQL query writing and optimization
- RESTful API development
- Frontend-backend integration
- Authentication and session management
- Modern web development practices

## 👥 Contributors

- Ayush Pai
- Jondash Karamavruc
- Aditya Veerathu

## 📄 License

This project is for educational purposes as part of our Databases Classes.

---

**Note**: This is a mock application designed for learning purposes. Do not use in production without proper security measures.