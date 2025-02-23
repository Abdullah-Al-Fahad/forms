# Forms Management System

## Overview
The **Forms** is a full-stack web application designed to help users create, manage, and organize templates with associated questions, tags, and forms. The system provides features such as creating templates, adding questions, associating tags, viewing results, and managing user roles. Frontend code is in frontend branch and backend code is in backend branch in this github repo.

This project consists of:
- **Frontend**: Built using React.js for a dynamic and responsive user interface.
- **Backend**: Built using Node.js, Express.js, and Sequelize ORM for robust API handling and database management.
- **Database**: PostgreSQL is used for storing templates, questions, tags, and other related data.

---

## Table of Contents
1. [Features](#features)
2. [Installation](#installation)
3. [Branch Information](#branch-information)
4. [API Documentation](#api-documentation)
5. [Troubleshooting](#troubleshooting)
6. [Contributing](#contributing)


---

## Features
### Frontend
- Create, edit, and delete templates.
- Add and manage questions within templates.
- Associate tags with templates for better categorization.
- View aggregated results and analytics for submitted forms.
- Responsive UI for seamless usage across devices.

### Backend
- RESTful API endpoints for managing templates, questions, tags, and forms.
- Authentication and authorization using JWT tokens.
- Role-based access control (e.g., Admin, User).
- Database relationships between templates, questions, tags, and users.

---

## Installation

### Prerequisites
Before running the project, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL
- Git

### Steps to Run the Project

#### 1. Clone the Repository
\`\`\`bash
git clone [https://github.com/yourusername/template-management-system.git](https://github.com/Abdullah-Al-Fahad/forms.git)
\`\`\`

#### 2. Install Dependencies
Switch to the appropriate branch (\`frontend\` or \`backend\`) and install dependencies.

##### Backend
\`\`\`bash
git checkout backend
npm install
\`\`\`

##### Frontend
\`\`\`bash
git checkout frontend
npm install
\`\`\`

#### 3. Set Up Environment Variables
Create a \`.env\` file in the \`backend\` directory with the following variables:

\`\`\`env
PORT=5000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
JWT_SECRET=your_jwt_secret
\`\`\`

#### 4. Set Up the Database
Ensure PostgreSQL is running locally. Create a database and update the \`.env\` file with the correct credentials.

Run migrations to set up the database schema:
\`\`\`bash
npx sequelize-cli db:migrate
\`\`\`

#### 5. Start the Servers
##### Backend
\`\`\`bash
npm start
\`\`\`
The backend server will run on \`http://localhost:5000\`.

##### Frontend
\`\`\`bash
npm run dev
\`\`\`
The frontend will run on \`http://localhost:3000\`.

---

## Branch Information
The project is divided into two main branches:
- **Frontend Code**: Located in the \`frontend\` branch. This branch contains all the React.js code for the user interface.
- **Backend Code**: Located in the \`backend\` branch. This branch contains all the Node.js, Express.js, and Sequelize code for the API and database logic.

To switch between branches:
\`\`\`bash
# Switch to frontend branch
git checkout frontend

# Switch to backend branch
git checkout backend
\`\`\`

---

## API Documentation

### Base URL
All API endpoints are prefixed with \`/api\`.

### Endpoints
#### Templates
- **GET /templates**: Fetch all templates.
- **GET /templates/:id**: Fetch a single template by ID.
- **POST /templates**: Create a new template.
- **PUT /templates/:id**: Update an existing template.
- **DELETE /templates/:id**: Delete a template.

#### Forms
- **POST /forms/:id**: Submit answers for a template.

#### Authentication
- **POST /auth/register**: Register a new user.
- **POST /auth/login**: Log in an existing user.

For detailed API documentation, refer to the \`api-docs\` folder or use tools like Postman to test the endpoints.

---

## Troubleshooting

1. **Database Connection Issues**
   - Verify that PostgreSQL is running and the \`.env\` file contains the correct database credentials.
1. **Token Issue**
   - Logout and login again.

---

## Contributing
We welcome contributions from the community! To contribute:
1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   \`\`\`bash
   git checkout -b feature/your-feature-name
   \`\`\`
3. Commit your changes:
   \`\`\`bash
   git commit -m "Add your commit message here"
   \`\`\`
4. Push to your branch:
   \`\`\`bash
   git push origin feature/your-feature-name
   \`\`\`
5. Open a pull request against the \`main\` branch.

Please ensure your code adheres to the project's coding standards and includes appropriate tests.

---
## Deployed version
Check out the live version of the application: https://itranforms.vercel.app/
- Wait a moment it might take a while to load.
