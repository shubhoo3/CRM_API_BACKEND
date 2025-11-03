const { Enquiry, Employee } = require('../models');

// Public endpoint - Submit a new enquiry (no authentication required)
const submitPublicEnquiry = async (req, res) => {
  try {
    const { name, email, courseInterest } = req.body;

    // Validate input
    if (!name || !email || !courseInterest) {
      return res.status(400).json({
        success: false,
        message: 'All fields (name, email, courseInterest) are required.',
      });
    }

    // Create new enquiry
    const newEnquiry = await Enquiry.create({
      name,
      email,
      courseInterest,
      claimed: false,
      counselorId: null,
    });

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully.',
      data: {
        id: newEnquiry.id,
        name: newEnquiry.name,
        email: newEnquiry.email,
        courseInterest: newEnquiry.courseInterest,
      },
    });
  } catch (error) {
    console.error('Submit enquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while submitting enquiry.',
    });
  }
};

// Get all unclaimed enquiries (public enquiries)
const getPublicEnquiries = async (req, res) => {
  try {
    const publicEnquiries = await Enquiry.findAll({
      where: {
        claimed: false,
      },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      message: 'Public enquiries fetched successfully.',
      data: publicEnquiries,
    });
  } catch (error) {
    console.error('Fetch public enquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching public enquiries.',
    });
  }
};

// Get all enquiries claimed by the logged-in counselor (private enquiries)
const getPrivateEnquiries = async (req, res) => {
  try {
    const counselorId = req.user; // From JWT middleware

    const privateEnquiries = await Enquiry.findAll({
      where: {
        counselorId: counselorId,
        claimed: true,
      },
      include: [
        {
          model: Employee,
          as: 'counselor',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      message: 'Private enquiries fetched successfully.',
      data: privateEnquiries,
    });
  } catch (error) {
    console.error('Fetch private enquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching private enquiries.',
    });
  }
};

// Claim an enquiry
const claimEnquiry = async (req, res) => {
  try {
    const enquiryId = req.params.id;
    const counselorId = req.user; // From JWT middleware

    // Find the enquiry
    const enquiry = await Enquiry.findByPk(enquiryId);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found.',
      });
    }

    // CRITICAL BUSINESS LOGIC: Check if already claimed
    if (enquiry.claimed === true) {
      return res.status(409).json({
        success: false,
        message: 'This enquiry has already been claimed by another counselor.',
      });
    }

    // Update the enquiry to claimed status
    enquiry.claimed = true;
    enquiry.counselorId = counselorId;
    await enquiry.save();

    // Fetch the updated enquiry with counselor details
    const updatedEnquiry = await Enquiry.findByPk(enquiryId, {
      include: [
        {
          model: Employee,
          as: 'counselor',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: 'Enquiry claimed successfully.',
      data: updatedEnquiry,
    });
  } catch (error) {
    console.error('Claim enquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while claiming enquiry.',
    });
  }
};

module.exports = {
  submitPublicEnquiry,
  getPublicEnquiries,
  getPrivateEnquiries,
  claimEnquiry,
};