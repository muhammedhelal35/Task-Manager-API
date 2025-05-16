# Task Manager API

A robust and scalable RESTful API for task management built with Node.js, Express, and MongoDB.

## 🚀 Features

- **User Management**
  - User registration and authentication
  - JWT-based authentication
  - Password hashing with bcrypt
  - User profile management
  - Secure password change functionality
  - Account deletion

- **Task Management**
  - Create, read, update, and delete tasks
  - Task status tracking (pending, in-progress, completed)
  - Priority levels (low, medium, high)
  - Due date management
  - Task filtering and sorting
  - Pagination support

- **Security**
  - JWT token-based authentication
  - Password encryption
  - Input validation
  - Request sanitization
  - Token blacklisting for logout
  - Protected routes

## 🛠️ Technologies Used

- **Backend Framework**
  - Node.js
  - Express.js

- **Database**
  - MongoDB
  - Mongoose ODM

- **Authentication**
  - JSON Web Tokens (JWT)
  - bcryptjs for password hashing

- **Validation**
  - Joi for request validation
  - Custom validation middleware

- **Error Handling**
  - Custom error handling middleware
  - Centralized error handling
  - Detailed error messages

- **Logging**
  - Winston logger
  - Error and combined logs

## 📁 Project Structure

```
task-manager-API/
├── config/             # Configuration files
├── controllers/        # Route controllers
├── middleware/         # Custom middleware
├── models/            # Database models
├── repositories/      # Data access layer
├── routes/            # API routes
├── services/          # Business logic
├── utils/             # Utility functions
├── validations/       # Request validation schemas
├── app.js            # Express application
└── server.js         # Server entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/muhammedhelal35/Task-Manager-API.git
cd task-manager-API
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
```

4. Start the server:
```bash
npm start
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/users/register
Content-Type: application/json

{
    "name": "name",
    "email": "name@gmail.com",
    "password": "password123"
}
```

#### Login
```http
POST /api/users/login
Content-Type: application/json

{
    "email": "name@gmail.com",
    "password": "password123"
}
```

### Task Endpoints

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
    "title": "Complete Project",
    "description": "Finish the task manager API",
    "status": "pending",
    "priority": "high",
    "dueDate": "2024-03-20T15:00:00.000Z"
}
```

#### Get All Tasks
```http
GET /api/tasks
Authorization: Bearer <token>
```

#### Get Single Task
```http
GET /api/tasks/:id
Authorization: Bearer <token>
```

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
    "status": "in-progress"
}
```

#### Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

## 🔒 Security Features

- Password hashing using bcrypt
- JWT token-based authentication
- Request validation using Joi
- Input sanitization
- Token blacklisting for logout
- Protected routes
- Error handling middleware

## 🧪 Validation Rules

### User Validation
- Email: Valid email format
- Password: Minimum 8 characters, at least one letter and one number
- Name: 2-50 characters

### Task Validation
- Title: 3-100 characters
- Description: Maximum 500 characters
- Status: One of ["pending", "in-progress", "completed"]
- Priority: One of ["low", "medium", "high"]
- Due Date: Must be in the future

## 📝 Error Handling

The API uses a centralized error handling system with custom error classes:
- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Server errors (500)

## 🔄 Pagination and Filtering

Tasks can be filtered and sorted using query parameters:
```http
GET /api/tasks?status=pending&priority=high&sort=dueDate:asc&page=1&limit=10
```

## 📈 Logging

The application uses Winston for logging:
- Combined logs: All logs
- Error logs: Error-specific logs
- Log rotation
- Different log levels

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- Express.js documentation
- MongoDB documentation
- JWT documentation
- Joi validation library
