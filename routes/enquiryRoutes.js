const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth');
const {
  submitPublicEnquiry,
  getPublicEnquiries,
  getPrivateEnquiries,
  claimEnquiry,
} = require('../controllers/enquiryController');

// Submit a new enquiry (NO AUTH REQUIRED)
router.post('/public', submitPublicEnquiry);

// Get all unclaimed enquiries (AUTH REQUIRED)
router.get('/public', authenticateToken, getPublicEnquiries);

// Get enquiries claimed by logged-in counselor (AUTH REQUIRED)
router.get('/private', authenticateToken, getPrivateEnquiries);

// Claim an enquiry (AUTH REQUIRED)
router.patch('/:id/claim', authenticateToken, claimEnquiry);

module.exports = router;