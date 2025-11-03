const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Employee } = require('../models');
require('dotenv').config();

// Register a new employee/counselor
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'All fields (email, password, name) are required.',
      });
    }

    // Check if employee already exists
    const existingEmployee = await Employee.findOne({ where: { email } });
    if (existingEmployee) {
      return res.status(409).json({
        success: false,
        message: 'Employee with this email already exists.',
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new employee
    const newEmployee = await Employee.create({
      email,
      password: hashedPassword,
      name,
    });

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Employee registered successfully.',
      data: {
        id: newEmployee.id,
        email: newEmployee.email,
        name: newEmployee.name,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration.',
    });
  }
};

// Login an employee/counselor
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    // Find employee by email
    const employee = await Employee.findOne({ where: { email } });
    if (!employee) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: employee.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return success response with token
    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        employee: {
          id: employee.id,
          email: employee.email,
          name: employee.name,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    console.error(error.stack); 
    res.status(500).json({
      success: false,
      message: 'Internal server error during login.',
       error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
};