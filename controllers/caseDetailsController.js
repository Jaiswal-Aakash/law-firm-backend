const CaseDetails = require('../models/CaseDetails');

// Get all case details
const getAllCaseDetails = async (req, res) => {
  try {
    const { createdBy } = req.query;
    
    let cases;
    if (createdBy) {
      cases = await CaseDetails.findByCreatedBy(createdBy);
    } else {
      cases = await CaseDetails.findAll();
    }

    console.log('getAllCaseDetails - Cases found:', cases.length);
    console.log('getAllCaseDetails - Cases data:', cases);

    res.json({
      success: true,
      data: cases.map(caseDetail => caseDetail.toJSON()),
      count: cases.length
    });
  } catch (error) {
    console.error('Error fetching case details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching case details',
      error: error.message
    });
  }
};

// Get case details by ID (or SC Number if not starting with CASE)
const getCaseDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if id starts with "CASE" (actual case_id) or is SC Number
    let caseDetail;
    if (id.toUpperCase().startsWith('CASE')) {
      caseDetail = await CaseDetails.findById(id);
    } else {
      // If not starting with CASE, treat it as SC Number
      caseDetail = await CaseDetails.findByScNo(id);
    }

    if (!caseDetail) {
      return res.status(404).json({
        success: false,
        message: 'Case details not found'
      });
    }

    res.json({
      success: true,
      data: caseDetail.toJSON()
    });
  } catch (error) {
    console.error('Error fetching case details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching case details',
      error: error.message
    });
  }
};

// Get case details by SC Number
const getCaseDetailsByScNo = async (req, res) => {
  try {
    const { scNo } = req.params;
    const caseDetail = await CaseDetails.findByScNo(scNo);

    if (!caseDetail) {
      return res.status(404).json({
        success: false,
        message: 'Case details not found'
      });
    }

    res.json({
      success: true,
      data: caseDetail.toJSON()
    });
  } catch (error) {
    console.error('Error fetching case details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching case details',
      error: error.message
    });
  }
};

// Create new case details
const createCaseDetails = async (req, res) => {
  try {
    const { description, scNo, createdBy, courtName, caseType, courtCity, courtState } = req.body;

    if (!scNo || !description) {
      return res.status(400).json({
        success: false,
        message: 'SC Number and Description are required'
      });
    }

    // Check if case with SC Number already exists
    const existingCase = await CaseDetails.findByScNo(scNo);
    if (existingCase) {
      return res.status(409).json({
        success: false,
        message: 'Case with this SC Number already exists'
      });
    }

    const caseDetail = await CaseDetails.create(description, scNo, createdBy, courtName, caseType, courtCity, courtState);

    res.status(201).json({
      success: true,
      message: 'Case details created successfully',
      data: caseDetail.toJSON()
    });
  } catch (error) {
    console.error('Error creating case details:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating case details',
      error: error.message
    });
  }
};

// Update case details
const updateCaseDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, scNo, createdBy, courtName, caseType, courtCity, courtState } = req.body;

    // Check if id starts with "CASE" (actual case_id) or is SC Number
    let caseDetail;
    if (id.toUpperCase().startsWith('CASE')) {
      caseDetail = await CaseDetails.findById(id);
    } else {
      // If not starting with CASE, treat it as SC Number
      caseDetail = await CaseDetails.findByScNo(id);
    }

    if (!caseDetail) {
      return res.status(404).json({
        success: false,
        message: 'Case details not found'
      });
    }

    // Check if SC Number is being changed and if it's already taken
    if (scNo && scNo !== caseDetail.scNo) {
      const existingCase = await CaseDetails.findByScNo(scNo);
      if (existingCase) {
        return res.status(409).json({
          success: false,
          message: 'SC Number already in use'
        });
      }
    }

    await caseDetail.update(description, scNo, createdBy, courtName, caseType, courtCity, courtState);

    res.json({
      success: true,
      message: 'Case details updated successfully',
      data: caseDetail.toJSON()
    });
  } catch (error) {
    console.error('Error updating case details:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating case details',
      error: error.message
    });
  }
};

// Delete case details
const deleteCaseDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if id starts with "CASE" (actual case_id) or is SC Number
    let caseDetail;
    if (id.toUpperCase().startsWith('CASE')) {
      caseDetail = await CaseDetails.findById(id);
    } else {
      // If not starting with CASE, treat it as SC Number
      caseDetail = await CaseDetails.findByScNo(id);
    }

    if (!caseDetail) {
      return res.status(404).json({
        success: false,
        message: 'Case details not found'
      });
    }

    await caseDetail.delete();

    res.json({
      success: true,
      message: 'Case details deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting case details:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting case details',
      error: error.message
    });
  }
};

module.exports = {
  getAllCaseDetails,
  getCaseDetailsById,
  getCaseDetailsByScNo,
  createCaseDetails,
  updateCaseDetails,
  deleteCaseDetails
};

