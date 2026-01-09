const CaseComplainantDetails = require('../models/CaseComplainantDetails');

// Get all complainant details
const getAllComplainantDetails = async (req, res) => {
  try {
    const { caseId, createdBy } = req.query;
    
    let complainantDetails;
    if (caseId) {
      complainantDetails = await CaseComplainantDetails.findByCaseId(caseId);
    } else if (createdBy) {
      complainantDetails = await CaseComplainantDetails.findByCreatedBy(createdBy);
    } else {
      complainantDetails = await CaseComplainantDetails.findAll();
    }

    console.log('getAllComplainantDetails - Records found:', complainantDetails.length);

    res.json({
      success: true,
      data: complainantDetails.map(complainant => complainant.toJSON()),
      count: complainantDetails.length
    });
  } catch (error) {
    console.error('Error fetching complainant details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching complainant details',
      error: error.message
    });
  }
};

// Get complainant details by ID
const getComplainantDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    const complainantDetail = await CaseComplainantDetails.findById(parseInt(id));

    if (!complainantDetail) {
      return res.status(404).json({
        success: false,
        message: 'Complainant details not found'
      });
    }

    res.json({
      success: true,
      data: complainantDetail.toJSON()
    });
  } catch (error) {
    console.error('Error fetching complainant details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching complainant details',
      error: error.message
    });
  }
};

// Get complainant details by case_id
const getComplainantDetailsByCaseId = async (req, res) => {
  try {
    const { caseId } = req.params;
    const complainantDetails = await CaseComplainantDetails.findByCaseId(caseId);

    res.json({
      success: true,
      data: complainantDetails.map(complainant => complainant.toJSON()),
      count: complainantDetails.length
    });
  } catch (error) {
    console.error('Error fetching complainant details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching complainant details',
      error: error.message
    });
  }
};

// Create new complainant details
const createComplainantDetails = async (req, res) => {
  try {
    const { caseId, ccName, ccAddress, ccPhoneNumber, ccMail, createdBy } = req.body;

    if (!caseId || !ccName) {
      return res.status(400).json({
        success: false,
        message: 'Case ID and Complainant Name are required'
      });
    }

    const complainantDetail = await CaseComplainantDetails.create(
      caseId,
      ccName,
      ccAddress,
      ccPhoneNumber,
      ccMail,
      createdBy
    );

    res.status(201).json({
      success: true,
      message: 'Complainant details created successfully',
      data: complainantDetail.toJSON()
    });
  } catch (error) {
    console.error('Error creating complainant details:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating complainant details',
      error: error.message
    });
  }
};

// Update complainant details
const updateComplainantDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { caseId, ccName, ccAddress, ccPhoneNumber, ccMail, createdBy } = req.body;

    const complainantDetail = await CaseComplainantDetails.findById(parseInt(id));

    if (!complainantDetail) {
      return res.status(404).json({
        success: false,
        message: 'Complainant details not found'
      });
    }

    await complainantDetail.update(
      caseId,
      ccName,
      ccAddress,
      ccPhoneNumber,
      ccMail,
      createdBy
    );

    res.json({
      success: true,
      message: 'Complainant details updated successfully',
      data: complainantDetail.toJSON()
    });
  } catch (error) {
    console.error('Error updating complainant details:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating complainant details',
      error: error.message
    });
  }
};

// Delete complainant details
const deleteComplainantDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const complainantDetail = await CaseComplainantDetails.findById(parseInt(id));

    if (!complainantDetail) {
      return res.status(404).json({
        success: false,
        message: 'Complainant details not found'
      });
    }

    await complainantDetail.delete();

    res.json({
      success: true,
      message: 'Complainant details deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting complainant details:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting complainant details',
      error: error.message
    });
  }
};

module.exports = {
  getAllComplainantDetails,
  getComplainantDetailsById,
  getComplainantDetailsByCaseId,
  createComplainantDetails,
  updateComplainantDetails,
  deleteComplainantDetails
};

