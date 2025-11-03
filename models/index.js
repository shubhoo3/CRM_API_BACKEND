const { sequelize } = require('../config/database');
const Employee = require('./employee');
const Enquiry = require('./enquiry');

// Define relationships
Employee.hasMany(Enquiry, {
  foreignKey: 'counselorId',
  as: 'enquiries',
});

Enquiry.belongsTo(Employee, {
  foreignKey: 'counselorId',
  as: 'counselor',
});

// Sync models with database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✓ Database models synchronized successfully.');
  } catch (error) {
    console.error('✗ Error syncing database:', error);
  }
};

module.exports = {
  Employee,
  Enquiry,
  syncDatabase,
};