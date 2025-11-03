const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/employeeController');

// POST /api/employees/register - Register a new employee/counselor
router.post('/register', register);

// POST /api/employees/login - Login an employee/counselor
router.post('/login', login);

module.exports = router;