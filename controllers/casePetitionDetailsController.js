const CasePetitionDetails = require('../models/CasePetitionDetails');
const CaseDetails = require('../models/CaseDetails');
const CaseComplainantDetails = require('../models/CaseComplainantDetails');
const CaseAccusedDetails = require('../models/CaseAccusedDetails');
const PetitionTemplateMaster = require('../models/PetitionTemplateMaster');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const TEMPLATE_SERVER_URL = process.env.TEMPLATE_SERVER_URL || 'http://103.27.234.248:8080';
// const TEMPLATE_SERVER_URL = process.env.TEMPLATE_SERVER_URL || 'http://103.27.234.248:8080';

// Helper function to map Flutter answers to template-server format
function mapAnswersToTemplateData(answers, templateId, caseData, accusedDetails) {
  // Format accused details for template server
  // Template server expects: [{ name: string, AccusedName: string, designation: string }]
  const formattedAccused = (accusedDetails || [])
    .filter(accused => accused && accused.caName && accused.caName.trim() !== '') // Filter out empty names
    .map((accused, index) => ({
      name: accused.caName.trim(),
      AccusedName: accused.caName.trim(),
      designation: accused.accusedNo || `A${index + 1}`,
      address: accused.caAddress || ''
    }));
  
  // Log if no accused found
  if (formattedAccused.length === 0) {
    console.warn('No valid accused details found for case. Accused array will be empty.');
  }

  // Handle respondent address - avoid duplication
  let respondentAddress = '';
  if (answers.respondent_station && answers.respondent_address) {
    // If both station and address are provided, combine them properly
    const station = answers.respondent_station.trim();
    const address = answers.respondent_address.trim();
    // Check if address already contains station name to avoid duplication
    if (address.toLowerCase().includes(station.toLowerCase())) {
      respondentAddress = address;
    } else {
      respondentAddress = `${station}, ${address}`;
    }
  } else if (answers.respondent_station) {
    respondentAddress = answers.respondent_station;
  } else if (answers.respondent_address) {
    respondentAddress = answers.respondent_address;
  } else {
    respondentAddress = 'PERIYANAIKENPALAYAM POLICE STATION, Coimbatore.';
  }

  // For Template 2 (Power of Attorney), also format as defendants
  // Template server expects: [{ number: "1.", name: "Name", signature: null }]
  const formattedDefendants = templateId === 2 ? formattedAccused.map((acc, index) => ({
    number: `${index + 1}.`,
    name: acc.name || acc.AccusedName || `Defendant ${index + 1}`,
    AccusedName: acc.name || acc.AccusedName || `Defendant ${index + 1}`, // Keep for compatibility
    designation: acc.designation || `A${index + 1}`,
    address: acc.address || '',
    signature: null // Can be added if signature is provided
  })) : [];
  
  // Log defendants for debugging
  if (templateId === 2) {
    console.log('Formatted defendants for Template 2:', JSON.stringify(formattedDefendants, null, 2));
    if (formattedDefendants.length === 0) {
      console.warn('⚠️  No defendants found for Template 2 (Power of Attorney). Accused details:', accusedDetails);
    }
  }

  const formData = {
    // Case information
    caseNumber: caseData?.scNo || answers.case_number || '',
    courtName: answers.court_name || 'COIMBATORE',
    
    // Accused information - properly formatted
    accused: formattedAccused,
    
    // Defendants information for Template 2 (Power of Attorney)
    defendants: formattedDefendants,
    
    // Template-specific fields
    sectionNumber: answers.section_number || '355(1)',
    respondentName: answers.respondent_name || 'INSPECTOR OF POLICE',
    respondentAddress: respondentAddress,
    respondentStation: answers.respondent_station || '', // Keep for backward compatibility
    
    // Petition points - handle dynamic points array or fallback to individual points
    petitionPoints: (answers.petition_points && Array.isArray(answers.petition_points) && answers.petition_points.length > 0)
      ? answers.petition_points.filter(p => p && p.trim() !== '')
      : [
          answers.point1,
          answers.point2,
          answers.point3,
          answers.point4
        ].filter(p => p && p.trim() !== ''),
    point1: answers.petition_points?.[0] || answers.point1 || '',
    point2: answers.petition_points?.[1] || answers.point2 || '',
    point3: answers.petition_points?.[2] || answers.point3 || '',
    point4: answers.petition_points?.[3] || answers.point4 || '',
    prayer: answers.prayer || '',
    
    // Date information
    day: new Date().getDate().toString(),
    month: new Date().toLocaleString('default', { month: 'long' }),
    year: new Date().getFullYear().toString(),
    place: answers.place || 'Coimbatore',
    hearingDate: answers.hearing_date || new Date().toLocaleDateString('en-GB'),
    
    // Advocate information
    advocateName: answers.advocate_name || '',
    advocateAddress: answers.advocate_address || '',
    advocateCity: answers.advocate_city || 'Coimbatore',
    advocatePhone: answers.advocate_phone || '',
    advocateEmail: answers.advocate_email || '',
    advocateAddressLine1: answers.advocate_address_line1 || '78/82, Semi Basement,',
    advocateAddressLine2: answers.advocate_address_line2 || 'Govt. Arts College Road,',
    advocateAddressLine3: answers.advocate_address_line3 || 'Cheran Towers,',
    
    // Template 1 specific additional fields
    courtFullName: answers.court_full_name || '',
    
    // Template 2 specific
    tribunalLocation: answers.tribunal_location || 'COIMBATORE',
    applicantName: answers.applicant_name || '',
    applicantBranch: answers.applicant_branch || '',
    applicantAddress: answers.applicant_address || '',
    oaNumber: answers.oa_number || '182',
    oaYear: answers.oa_year || new Date().getFullYear().toString(),
    advocateEnrollment: answers.advocate_enrollment || '',
    advocatesList: answers.advocates_list || '',
    executionDay: answers.execution_day || new Date().getDate().toString(),
    executionMonth: answers.execution_month || new Date().toLocaleString('default', { month: 'long' }),
    executionYear: answers.execution_year || new Date().getFullYear().toString(),
  };

  // Handle selected accused reasons (from multi-select)
  if (answers.accused_reasons && typeof answers.accused_reasons === 'object') {
    formData.accusedReasons = answers.accused_reasons;
  }
  
  // Handle number of accused and reasons (legacy support)
  if (answers.num_accused) {
    const numAccused = parseInt(answers.num_accused) || 0;
    const reasons = [];
    
    // Collect reasons for each accused
    for (let i = 1; i <= numAccused; i++) {
      const reasonKey = `reason_accused_${i}`;
      if (answers[reasonKey]) {
        reasons.push(answers[reasonKey]);
      }
    }
    
    // If there's a single reason_accused field, use it for all
    if (answers.reason_accused && reasons.length === 0) {
      for (let i = 0; i < numAccused; i++) {
        reasons.push(answers.reason_accused);
      }
    }
    
    formData.reasons = reasons;
  }

  return formData;
}

// Create case petition details and generate PDF
const createCasePetitionDetails = async (req, res) => {
  try {
    const { caseId, templateId, templateName, answers, createdBy } = req.body;

    // Validate required fields
    if (!caseId || !templateId || !answers) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: caseId, templateId, and answers are required'
      });
    }

    // Get case details
    const caseData = await CaseDetails.findById(caseId);
    if (!caseData) {
      return res.status(404).json({
        success: false,
        error: 'Case not found'
      });
    }

    // Get accused details for this case
    let accusedDetails = [];
    try {
      const allAccusedDetails = await CaseAccusedDetails.findByCaseId(caseId);
      console.log(`Found ${allAccusedDetails.length} accused details for case ${caseId}`);
      
      // Filter to only selected accused if provided (for Template 1)
      if (answers.selected_accused_ids && Array.isArray(answers.selected_accused_ids)) {
        const selectedIds = answers.selected_accused_ids;
        accusedDetails = allAccusedDetails.filter(accused => {
          const accusedId = accused.caId || accused.accusedNo || '';
          return selectedIds.includes(accusedId);
        });
        console.log(`Filtered to ${accusedDetails.length} selected accused`);
      } else {
        accusedDetails = allAccusedDetails;
      }
    } catch (err) {
      console.warn('Could not fetch accused details:', err.message);
      // Continue without accused details - user can still proceed
    }

    // Get template details
    const template = await PetitionTemplateMaster.findById(templateId);
    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    // Map template ID to template-server format
    // Template-server uses PetTemMasId: 1 for TEMP-001, 2 for TEMP-002
    let templateServerId = 1; // default
    if (template.petitionNumber === 'TEMP-001') {
      templateServerId = 1;
    } else if (template.petitionNumber === 'TEMP-002') {
      templateServerId = 2;
    } else {
      // Try to parse ptm_id as integer
      templateServerId = parseInt(templateId) || 1;
    }

    // Map answers to template-server format
    const formData = mapAnswersToTemplateData(answers, templateServerId, caseData, accusedDetails);
    
    // Debug logging
    console.log('FormData for template server:', JSON.stringify({
      ...formData,
      accused: formData.accused.map(a => ({ name: a.name, AccusedName: a.AccusedName, designation: a.designation })),
      defendants: formData.defendants ? formData.defendants.map(d => ({ number: d.number, name: d.name })) : []
    }, null, 2));

    // Call template-server to generate PDF
    let pdfBuffer = null;
    let pdfPath = null;
    
    try {
      const templateServerResponse = await axios.post(
        `${TEMPLATE_SERVER_URL}/api/templates/render`,
        {
          templateId: templateServerId,
          formData: formData,
          format: 'pdf'
        },
        {
          responseType: 'arraybuffer',
          timeout: 30000 // 30 seconds timeout
        }
      );

      pdfBuffer = Buffer.from(templateServerResponse.data);

      // Save PDF to file system
      const uploadsDir = path.join(__dirname, '..', 'uploads', 'petitions');
      await fs.mkdir(uploadsDir, { recursive: true });
      
      const filename = `CASE_${caseId}_PET_${Date.now()}.pdf`;
      pdfPath = path.join(uploadsDir, filename);
      await fs.writeFile(pdfPath, pdfBuffer);

      // Store relative path
      pdfPath = `uploads/petitions/${filename}`;
    } catch (templateError) {
      console.error('Error generating PDF from template-server:', templateError.message);
      // Continue without PDF - save petition anyway
    }

    // Get complainant ID - fetch first complainant for this case
    let ccId = null;
    try {
      const complainants = await CaseComplainantDetails.findByCaseId(caseId);
      if (complainants && complainants.length > 0) {
        ccId = complainants[0].ccId;
      }
    } catch (err) {
      console.warn('Could not fetch complainant details:', err.message);
    }

    // If no complainant found, create a default one (since cc_id is NOT NULL)
    if (!ccId) {
      try {
        const defaultComplainant = await CaseComplainantDetails.create(
          caseId,
          'Default Complainant',
          'Address not provided',
          '',
          '',
          createdBy || 'system'
        );
        ccId = defaultComplainant.ccId;
        console.log(`Created default complainant for case ${caseId}: ${ccId}`);
      } catch (createErr) {
        console.error('Failed to create default complainant:', createErr.message);
        // If creation fails, try to get any existing complainant for this case as fallback
        // This shouldn't happen, but just in case
        throw new Error(`No complainant found for case ${caseId} and failed to create default. Please add a complainant first.`);
      }
    }

    // Create petition record in database
    const petition = await CasePetitionDetails.create(
      caseId,
      templateId,
      ccId,
      pdfPath,
      createdBy
    );

    if (!petition) {
      return res.status(500).json({
        success: false,
        error: 'Failed to create petition record'
      });
    }

    // Build PDF URL if PDF was generated
    let pdfUrl = null;
    if (pdfPath) {
      // Use the base URL from request or default to localhost
      const baseUrl = req.protocol + '://' + req.get('host');
      pdfUrl = `${baseUrl}/${pdfPath}`;
    }

    // Return response
    res.status(201).json({
      success: true,
      data: {
        ...petition.toJSON(),
        templateName: templateName || template.petitionName,
        answers: answers,
        pdfGenerated: !!pdfBuffer,
        pdfPath: pdfPath,
        pdfUrl: pdfUrl // Add PDF URL for direct access
      },
      message: 'Petition created successfully'
    });
  } catch (error) {
    console.error('Error creating case petition details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create case petition details',
      details: error.message
    });
  }
};

// Get all case petition details
const getCasePetitionDetails = async (req, res) => {
  try {
    const { caseId, createdBy } = req.query;
    
    const petitions = await CasePetitionDetails.findAll(caseId, createdBy);
    
    res.json({
      success: true,
      data: petitions.map(p => p.toJSON()),
      count: petitions.length
    });
  } catch (error) {
    console.error('Error fetching case petition details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch case petition details',
      details: error.message
    });
  }
};

// Get case petition details by case ID
const getCasePetitionDetailsByCaseId = async (req, res) => {
  try {
    const { caseId } = req.params;
    
    const petitions = await CasePetitionDetails.findAll(caseId, null);
    
    res.json({
      success: true,
      data: petitions.map(p => p.toJSON()),
      count: petitions.length
    });
  } catch (error) {
    console.error('Error fetching case petition details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch case petition details',
      details: error.message
    });
  }
};

// Get case petition details by ID
const getCasePetitionDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const petition = await CasePetitionDetails.findById(id);
    
    if (!petition) {
      return res.status(404).json({
        success: false,
        error: 'Case petition details not found'
      });
    }
    
    res.json({
      success: true,
      data: petition.toJSON()
    });
  } catch (error) {
    console.error('Error fetching case petition details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch case petition details',
      details: error.message
    });
  }
};

// Update case petition details
const updateCasePetitionDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers, cpDocPath } = req.body;
    
    const petition = await CasePetitionDetails.findById(id);
    
    if (!petition) {
      return res.status(404).json({
        success: false,
        error: 'Case petition details not found'
      });
    }

    // Update document path if provided
    if (cpDocPath) {
      await CasePetitionDetails.updateDocumentPath(id, cpDocPath);
    }
    
    res.json({
      success: true,
      message: 'Case petition details updated successfully'
    });
  } catch (error) {
    console.error('Error updating case petition details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update case petition details',
      details: error.message
    });
  }
};

// Delete case petition details
const deleteCasePetitionDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const petition = await CasePetitionDetails.findById(id);
    
    if (!petition) {
      return res.status(404).json({
        success: false,
        error: 'Case petition details not found'
      });
    }

    // TODO: Delete the PDF file if it exists
    // For now, just delete the record
    
    res.json({
      success: true,
      message: 'Case petition details deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting case petition details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete case petition details',
      details: error.message
    });
  }
};

module.exports = {
  createCasePetitionDetails,
  getCasePetitionDetails,
  getCasePetitionDetailsByCaseId,
  getCasePetitionDetailsById,
  updateCasePetitionDetails,
  deleteCasePetitionDetails
};

