# CRM Backend

This is a backend API for a CRM (Customer Relationship Management) system. It is built with Node.js and Express, and uses a database for storing employee and enquiry data.

## Features

- Employee management (CRUD)
- Enquiry management (CRUD)
- Authentication middleware
- Organized MVC structure

## Project Structure

```
├── server.js                # Entry point for the server
├── package.json             # Project metadata and dependencies
├── config/
│   └── database.js          # Database connection setup
├── controllers/
│   ├── employeeController.js
│   └── enquiryController.js
├── middlewares/
│   └── auth.js              # Authentication middleware
├── models/
│   ├── employee.js
│   ├── enquiry.js
│   └── index.js
├── routes/
│   ├── employeeRoutes.js
│   └── enquiryRoutes.js
└── api_screenshots_output/  # (Optional) Output folder for API screenshots
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- npm (Node package manager)
- Database (e.g., SQLITE, MongoDB, MySQL, etc. as configured in `config/database.js`)

### Installation

1. Clone the repository or download the source code.
2. Install dependencies:
   ```
   npm install
   ```
3. Configure your database connection in `config/database.js`.
4. Start the server:
   ```
   node server.js
   ```

## API Endpoints

### Employees

- `GET /employees` - List all employees
- `POST /employees` - Create a new employee
- `GET /employees/:id` - Get employee by ID
- `PUT /employees/:id` - Update employee by ID
- `DELETE /employees/:id` - Delete employee by ID

### Enquiries

- `GET /enquiries` - List all enquiries
- `POST /enquiries` - Create a new enquiry
- `GET /enquiries/:id` - Get enquiry by ID
- `PUT /enquiries/:id` - Update enquiry by ID
- `DELETE /enquiries/:id` - Delete enquiry by ID

## Authentication

Some routes may be protected using the authentication middleware in `middlewares/auth.js`. Ensure to provide valid credentials or tokens as required.


