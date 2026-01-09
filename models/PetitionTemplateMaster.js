const { query } = require('../config/database');

// PetitionTemplateMaster Model with PostgreSQL integration
class PetitionTemplateMaster {
  constructor(petTemMasId, petitionNumber, petitionName, description, templatePath, templateType, isActive, questions, createdOn, updatedOn, createdBy) {
    this.petTemMasId = petTemMasId;
    this.petitionNumber = petitionNumber;
    this.petitionName = petitionName;
    this.description = description;
    this.templatePath = templatePath;
    this.templateType = templateType;
    this.isActive = isActive;
    this.questions = questions || [];
    this.createdOn = createdOn || new Date();
    this.updatedOn = updatedOn;
    this.createdBy = createdBy;
  }

  // Convert to JSON (Flutter app format)
  toJSON() {
    return {
      templateId: this.petTemMasId?.toString(),
      templateName: this.petitionName,
      description: this.description || this.petitionName, // Use petition name as description if description doesn't exist
      questions: this.questions || [],
      createdOn: this.createdOn,
      createdBy: this.createdBy
    };
  }

  // Fetch questions from database for a template
  // This is the ONLY way questions are fetched - no hardcoded fallback
  static async getQuestionsFromDatabase(ptmId) {
    try {
      const result = await query(
        'SELECT * FROM "tblPetitionTemplateQuestions" WHERE "ptm_id" = $1 ORDER BY "display_order" ASC, "tq_id" ASC',
        [ptmId]
      );
      
      if (result.rows.length === 0) {
        console.warn(`⚠️  No questions found in database for template ptm_id: ${ptmId}. Please add questions to tblPetitionTemplateQuestions table.`);
        return [];
      }
      
      return result.rows.map(row => ({
        questionId: row.question_id,
        questionText: row.question_text,
        questionType: row.question_type,
        isRequired: row.is_required !== false, // Default to true if null
        placeholder: row.placeholder || '',
        options: row.options || null // For dropdown questions
      }));
    } catch (error) {
      console.error('❌ Error fetching questions from database:', error);
      throw new Error(`Failed to fetch questions from database: ${error.message}`);
    }
  }

  // Get all petition templates
  static async findAll() {
    const result = await query(
      'SELECT * FROM "tblPetitionTemplateMaster" ORDER BY "ptm_id" ASC'
    );
    
    // Fetch all templates with their questions from database
    const templates = await Promise.all(
      result.rows.map(async (row) => {
        // Fetch questions from database ONLY - no hardcoded fallback
        const questions = await PetitionTemplateMaster.getQuestionsFromDatabase(row.ptm_id);
        
        // Get template name from database (or use pet_number as fallback)
        const templateName = row.template_name || row.pet_number || 'Petition Template';
        
        return new PetitionTemplateMaster(
          row.ptm_id,
          row.pet_number,
          templateName, // From database column template_name
          null, // Description column doesn't exist
          row.pet_temp_path,
          null, // TemplateType column doesn't exist
          null, // IsActive column doesn't exist
          questions, // Always from database
          row.created_on,
          null, // UpdatedDate column doesn't exist
          row.created_by
        );
      })
    );
    
    return templates;
  }

  // Find template by ID
  static async findById(petTemMasId) {
    const result = await query(
      'SELECT * FROM "tblPetitionTemplateMaster" WHERE "ptm_id" = $1',
      [petTemMasId]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const row = result.rows[0];
    
    // Fetch questions from database ONLY - no hardcoded fallback
    const questions = await PetitionTemplateMaster.getQuestionsFromDatabase(row.ptm_id);
    
    // Get template name from database (or use pet_number as fallback)
    const templateName = row.template_name || row.pet_number || 'Petition Template';
    
    return new PetitionTemplateMaster(
      row.ptm_id,
      row.pet_number,
      templateName, // From database column template_name
      null, // Description column doesn't exist
      row.pet_temp_path,
      null, // TemplateType column doesn't exist
      null, // IsActive column doesn't exist
      questions, // Always from database
      row.created_on,
      null, // UpdatedDate column doesn't exist
      row.created_by
    );
  }

  // Find template by petition number
  static async findByPetitionNumber(petitionNumber) {
    const result = await query(
      'SELECT * FROM "tblPetitionTemplateMaster" WHERE "pet_number" = $1',
      [petitionNumber]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const row = result.rows[0];
    
    // Fetch questions from database ONLY - no hardcoded fallback
    const questions = await PetitionTemplateMaster.getQuestionsFromDatabase(row.ptm_id);
    
    // Get template name from database (or use pet_number as fallback)
    const templateName = row.template_name || row.pet_number || 'Petition Template';
    
    return new PetitionTemplateMaster(
      row.ptm_id,
      row.pet_number,
      templateName, // From database column template_name
      null, // Description column doesn't exist
      row.pet_temp_path,
      null, // TemplateType column doesn't exist
      null, // IsActive column doesn't exist
      questions, // Always from database
      row.created_on,
      null, // UpdatedDate column doesn't exist
      row.created_by
    );
  }
}

module.exports = PetitionTemplateMaster;

