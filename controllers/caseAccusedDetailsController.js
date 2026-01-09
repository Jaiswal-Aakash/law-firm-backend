const CaseAccusedDetails = require('../models/CaseAccusedDetails');

// Get all accused details
const getAllAccusedDetails = async (req, res) => {
  try {
    const { caseId, createdBy } = req.query;
    
    let accusedDetails;
    if (caseId) {
      accusedDetails = await CaseAccusedDetails.findByCaseId(caseId);
    } else if (createdBy) {
      accusedDetails = await CaseAccusedDetails.findByCreatedBy(createdBy);
    } else {
      accusedDetails = await CaseAccusedDetails.findAll();
    }

    console.log('getAllAccusedDetails - Records found:', accusedDetails.length);

    res.json({
      success: true,
      data: accusedDetails.map(accused => accused.toJSON()),
      count: accusedDetails.length
    });
  } catch (error) {
    console.error('Error fetching accused details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching accused details',
      error: error.message
    });
  }
};

// Get accused details by ID (or accused_no if not numeric)
const getAccusedDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if id starts with "CA" (actual ca_id) or is accused_no
    let accusedDetail;
    if (id.toUpperCase().startsWith('CA')) {
      accusedDetail = await CaseAccusedDetails.findById(id);
    } else {
      // If not starting with CA, treat it as accused_no
      accusedDetail = await CaseAccusedDetails.findByAccusedNo(id);
    }

    if (!accusedDetail) {
      return res.status(404).json({
        success: false,
        message: 'Accused details not found'
      });
    }

    res.json({
      success: true,
      data: accusedDetail.toJSON()
    });
  } catch (error) {
    console.error('Error fetching accused details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching accused details',
      error: error.message
    });
  }
};

// Get accused details by case_id
const getAccusedDetailsByCaseId = async (req, res) => {
  try {
    const { caseId } = req.params;
    const accusedDetails = await CaseAccusedDetails.findByCaseId(caseId);

    res.json({
      success: true,
      data: accusedDetails.map(accused => accused.toJSON()),
      count: accusedDetails.length
    });
  } catch (error) {
    console.error('Error fetching accused details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching accused details',
      error: error.message
    });
  }
};

// Get accused details by accused_no
const getAccusedDetailsByAccusedNo = async (req, res) => {
  try {
    const { accusedNo } = req.params;
    const accusedDetail = await CaseAccusedDetails.findByAccusedNo(accusedNo);

    if (!accusedDetail) {
      return res.status(404).json({
        success: false,
        message: 'Accused details not found'
      });
    }

    res.json({
      success: true,
      data: accusedDetail.toJSON()
    });
  } catch (error) {
    console.error('Error fetching accused details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching accused details',
      error: error.message
    });
  }
};

// Create new accused details
const createAccusedDetails = async (req, res) => {
  try {
    const { caseId, caName, caPhoneNumber, caEmail, caAddress, accusedNo, caSignaturePath, createdBy } = req.body;

    if (!caseId || !caName) {
      return res.status(400).json({
        success: false,
        message: 'Case ID and Accused Name are required'
      });
    }

    const accusedDetail = await CaseAccusedDetails.create(
      caseId,
      caName,
      caPhoneNumber,
      caEmail,
      caAddress,
      accusedNo,
      caSignaturePath,
      createdBy
    );

    res.status(201).json({
      success: true,
      message: 'Accused details created successfully',
      data: accusedDetail.toJSON()
    });
  } catch (error) {
    console.error('Error creating accused details:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating accused details',
      error: error.message
    });
  }
};

// Update accused details
const updateAccusedDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { caseId, caName, caPhoneNumber, caEmail, caAddress, accusedNo, caSignaturePath, createdBy } = req.body;

    // Check if id starts with "CA" (actual ca_id) or is accused_no
    let accusedDetail;
    if (id.toUpperCase().startsWith('CA')) {
      accusedDetail = await CaseAccusedDetails.findById(id);
    } else {
      // If not starting with CA, treat it as accused_no
      accusedDetail = await CaseAccusedDetails.findByAccusedNo(id);
    }

    if (!accusedDetail) {
      return res.status(404).json({
        success: false,
        message: 'Accused details not found'
      });
    }

    await accusedDetail.update(
      caseId,
      caName,
      caPhoneNumber,
      caEmail,
      caAddress,
      accusedNo,
      caSignaturePath,
      createdBy
    );

    res.json({
      success: true,
      message: 'Accused details updated successfully',
      data: accusedDetail.toJSON()
    });
  } catch (error) {
    console.error('Error updating accused details:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating accused details',
      error: error.message
    });
  }
};

// Delete accused details
const deleteAccusedDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if id starts with "CA" (actual ca_id) or is accused_no
    let accusedDetail;
    if (id.toUpperCase().startsWith('CA')) {
      accusedDetail = await CaseAccusedDetails.findById(id);
    } else {
      // If not starting with CA, treat it as accused_no
      accusedDetail = await CaseAccusedDetails.findByAccusedNo(id);
    }

    if (!accusedDetail) {
      return res.status(404).json({
        success: false,
        message: 'Accused details not found'
      });
    }

    await accusedDetail.delete();

    res.json({
      success: true,
      message: 'Accused details deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting accused details:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting accused details',
      error: error.message
    });
  }
};

module.exports = {
  getAllAccusedDetails,
  getAccusedDetailsById,
  getAccusedDetailsByCaseId,
  getAccusedDetailsByAccusedNo,
  createAccusedDetails,
  updateAccusedDetails,
  deleteAccusedDetails
};

