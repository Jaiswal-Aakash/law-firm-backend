const { query } = require('../config/database');

// CasePetitionDetails Model with PostgreSQL integration
class CasePetitionDetails {
  constructor(cpId, caseId, ccId, petTemMasId, cpDocPath, createdOn, createdBy) {
    this.cpId = cpId;
    this.caseId = caseId;
    this.ccId = ccId;
    this.petTemMasId = petTemMasId;
    this.cpDocPath = cpDocPath;
    this.createdOn = createdOn || new Date();
    this.createdBy = createdBy;
  }

  // Convert to JSON (Flutter app format)
  toJSON() {
    return {
      petitionId: this.cpId?.toString(),
      caseId: this.caseId?.toString(),
      templateId: this.petTemMasId?.toString(),
      documentPath: this.cpDocPath,
      createdOn: this.createdOn,
      createdBy: this.createdBy
    };
  }

  // Create new case petition details
  static async create(caseId, petTemMasId, ccId, cpDocPath, createdBy) {
    // Generate a unique ID
    const cpId = `CP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const result = await query(
      `INSERT INTO "tblCasePetitionDetails" 
       ("cp_id", "case_id", "cc_id", "pet_tem_mas_id", "cp_doc_path", "created_by", "created_on")
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
       RETURNING *`,
      [cpId, caseId, ccId || null, petTemMasId, cpDocPath || null, createdBy || null]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new CasePetitionDetails(
      row.cp_id,
      row.case_id,
      row.cc_id,
      row.pet_tem_mas_id,
      row.cp_doc_path,
      row.created_on,
      row.created_by
    );
  }

  // Get all case petition details
  static async findAll(caseId = null, createdBy = null) {
    let sql = 'SELECT * FROM "tblCasePetitionDetails" WHERE 1=1';
    const params = [];
    
    if (caseId) {
      params.push(caseId);
      sql += ` AND "case_id" = $${params.length}`;
    }
    
    if (createdBy) {
      params.push(createdBy);
      sql += ` AND "created_by" = $${params.length}`;
    }
    
    sql += ' ORDER BY "created_on" DESC';
    
    const result = await query(sql, params);
    
    return result.rows.map(row => {
      return new CasePetitionDetails(
        row.cp_id,
        row.case_id,
        row.cc_id,
        row.pet_tem_mas_id,
        row.cp_doc_path,
        row.created_on,
        row.created_by
      );
    });
  }

  // Find by ID
  static async findById(cpId) {
    const result = await query(
      'SELECT * FROM "tblCasePetitionDetails" WHERE "cp_id" = $1',
      [cpId]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const row = result.rows[0];
    return new CasePetitionDetails(
      row.cp_id,
      row.case_id,
      row.cc_id,
      row.pet_tem_mas_id,
      row.cp_doc_path,
      row.created_on,
      row.created_by
    );
  }

  // Update document path
  static async updateDocumentPath(cpId, cpDocPath) {
    const result = await query(
      'UPDATE "tblCasePetitionDetails" SET "cp_doc_path" = $1 WHERE "cp_id" = $2 RETURNING *',
      [cpDocPath, cpId]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const row = result.rows[0];
    return new CasePetitionDetails(
      row.cp_id,
      row.case_id,
      row.cc_id,
      row.pet_tem_mas_id,
      row.cp_doc_path,
      row.created_on,
      row.created_by
    );
  }
}

module.exports = CasePetitionDetails;


