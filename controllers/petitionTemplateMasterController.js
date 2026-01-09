const PetitionTemplateMaster = require('../models/PetitionTemplateMaster');

// Get all petition templates
const getAllPetitionTemplates = async (req, res) => {
  try {
    const templates = await PetitionTemplateMaster.findAll();
    
    console.log('getAllPetitionTemplates - Templates found:', templates.length);
    
    res.json({
      success: true,
      data: templates.map(template => template.toJSON()),
      count: templates.length
    });
  } catch (error) {
    console.error('Error fetching petition templates:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching petition templates',
      error: error.message
    });
  }
};

// Get petition template by ID
const getPetitionTemplateById = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await PetitionTemplateMaster.findById(id);
    
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Petition template not found'
      });
    }
    
    res.json({
      success: true,
      data: template.toJSON()
    });
  } catch (error) {
    console.error('Error fetching petition template:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching petition template',
      error: error.message
    });
  }
};

// Get petition template by petition number
const getPetitionTemplateByNumber = async (req, res) => {
  try {
    const { number } = req.params;
    const template = await PetitionTemplateMaster.findByPetitionNumber(number);
    
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Petition template not found'
      });
    }
    
    res.json({
      success: true,
      data: template.toJSON()
    });
  } catch (error) {
    console.error('Error fetching petition template:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching petition template',
      error: error.message
    });
  }
};

module.exports = {
  getAllPetitionTemplates,
  getPetitionTemplateById,
  getPetitionTemplateByNumber
};

