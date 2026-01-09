const LawFirm = require('../models/LawFirm');

// Get all law firms
const getAllLawFirms = async (req, res) => {
  try {
    const { search } = req.query;
    
    let lawFirms;
    if (search) {
      lawFirms = await LawFirm.searchByName(search);
    } else {
      lawFirms = await LawFirm.findAll();
    }
    
    res.json({
      success: true,
      data: lawFirms.map(firm => firm.toJSON()),
      count: lawFirms.length
    });
  } catch (error) {
    console.error('Error fetching law firms:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching law firms',
      error: error.message
    });
  }
};

// Get law firm by ID
const getLawFirmById = async (req, res) => {
  try {
    const { id } = req.params;
    const lawFirm = await LawFirm.findById(id);

    if (!lawFirm) {
      return res.status(404).json({
        success: false,
        message: 'Law firm not found'
      });
    }

    res.json({
      success: true,
      data: lawFirm.toJSON()
    });
  } catch (error) {
    console.error('Error fetching law firm:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching law firm',
      error: error.message
    });
  }
};

// Create new law firm
const createLawFirm = async (req, res) => {
  try {
    const { l_name, l_designation, l_address, l_phone_number, l_email, created_by } = req.body;

    if (!l_name || l_name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Law firm name is required'
      });
    }

    // Check if law firm with name already exists
    const existingFirm = await LawFirm.findByName(l_name.trim());
    if (existingFirm) {
      return res.status(409).json({
        success: false,
        message: 'Law firm with this name already exists'
      });
    }

    const lawFirm = await LawFirm.create({
      l_name: l_name.trim(),
      l_designation,
      l_address,
      l_phone_number,
      l_email
    }, created_by);

    res.status(201).json({
      success: true,
      message: 'Law firm created successfully',
      data: lawFirm.toJSON()
    });
  } catch (error) {
    console.error('Error creating law firm:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating law firm',
      error: error.message
    });
  }
};

// Delete law firm
const deleteLawFirm = async (req, res) => {
  try {
    const { id } = req.params;
    const lawFirm = await LawFirm.findById(id);

    if (!lawFirm) {
      return res.status(404).json({
        success: false,
        message: 'Law firm not found'
      });
    }

    await lawFirm.delete();

    res.json({
      success: true,
      message: 'Law firm deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting law firm:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting law firm',
      error: error.message
    });
  }
};

module.exports = {
  getAllLawFirms,
  getLawFirmById,
  createLawFirm,
  deleteLawFirm
};

