const { query } = require('../config/database');

// CaseComplainantDetails Model with PostgreSQL integration
class CaseComplainantDetails {
  constructor(ccId, caseId, ccName, ccAddress, ccPhoneNumber, ccMail, createdOn, createdBy) {
    this.ccId = ccId;
    this.caseId = caseId;
    this.ccName = ccName;
    this.ccAddress = ccAddress;
    this.ccPhoneNumber = ccPhoneNumber;
    this.ccMail = ccMail;
    this.createdOn = createdOn || new Date();
    this.createdBy = createdBy || null;
  }

  // Convert to JSON
  toJSON() {
    return {
      ccId: this.ccId,
      caseId: this.caseId,
      ccName: this.ccName,
      ccAddress: this.ccAddress,
      ccPhoneNumber: this.ccPhoneNumber,
      ccMail: this.ccMail,
      createdOn: this.createdOn,
      createdBy: this.createdBy
    };
  }

  // Get all complainant details
  static async findAll() {
    const result = await query(
      'SELECT * FROM "tblCaseComplainantDetails" ORDER BY created_on DESC'
    );
    
    console.log('findAll - Number of rows:', result.rows.length);
    if (result.rows.length > 0) {
      console.log('findAll - First row sample:', JSON.stringify(result.rows[0], null, 2));
    }
    
    return result.rows.map(row => {
      return new CaseComplainantDetails(
        row.cc_id,
        row.case_id,
        row.cc_name,
        row.cc_address,
        row.cc_phone_number,
        row.cc_mail,
        row.created_on,
        row.created_by
      );
    });
  }

  // Find complainant details by ID
  static async findById(ccId) {
    const result = await query(
      'SELECT * FROM "tblCaseComplainantDetails" WHERE cc_id = $1',
      [ccId]
    );
    if (result.rows.length === 0) {
      return null;
    }
    const row = result.rows[0];
    return new CaseComplainantDetails(
      row.cc_id,
      row.case_id,
      row.cc_name,
      row.cc_address,
      row.cc_phone_number,
      row.cc_mail,
      row.created_on,
      row.created_by
    );
  }

  // Find complainant details by case_id
  static async findByCaseId(caseId) {
    const result = await query(
      'SELECT * FROM "tblCaseComplainantDetails" WHERE case_id = $1 ORDER BY created_on DESC',
      [caseId]
    );
    return result.rows.map(row => new CaseComplainantDetails(
      row.cc_id,
      row.case_id,
      row.cc_name,
      row.cc_address,
      row.cc_phone_number,
      row.cc_mail,
      row.created_on,
      row.created_by
    ));
  }

  // Find complainant details by created_by
  static async findByCreatedBy(createdBy) {
    const result = await query(
      'SELECT * FROM "tblCaseComplainantDetails" WHERE created_by = $1 ORDER BY created_on DESC',
      [createdBy]
    );
    return result.rows.map(row => new CaseComplainantDetails(
      row.cc_id,
      row.case_id,
      row.cc_name,
      row.cc_address,
      row.cc_phone_number,
      row.cc_mail,
      row.created_on,
      row.created_by
    ));
  }

  // Create new complainant details
  static async create(caseId, ccName, ccAddress, ccPhoneNumber, ccMail, createdBy) {
    const result = await query(
      'INSERT INTO "tblCaseComplainantDetails" (case_id, cc_name, cc_address, cc_phone_number, cc_mail, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [caseId, ccName, ccAddress, ccPhoneNumber, ccMail, createdBy]
    );
    const row = result.rows[0];
    return new CaseComplainantDetails(
      row.cc_id,
      row.case_id,
      row.cc_name,
      row.cc_address,
      row.cc_phone_number,
      row.cc_mail,
      row.created_on,
      row.created_by
    );
  }

  // Update complainant details
  async update(caseId, ccName, ccAddress, ccPhoneNumber, ccMail, createdBy) {
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (caseId !== undefined) {
      updates.push(`case_id = $${paramCount}`);
      values.push(caseId);
      paramCount++;
      this.caseId = caseId;
    }

    if (ccName !== undefined) {
      updates.push(`cc_name = $${paramCount}`);
      values.push(ccName);
      paramCount++;
      this.ccName = ccName;
    }

    if (ccAddress !== undefined) {
      updates.push(`cc_address = $${paramCount}`);
      values.push(ccAddress);
      paramCount++;
      this.ccAddress = ccAddress;
    }

    if (ccPhoneNumber !== undefined) {
      updates.push(`cc_phone_number = $${paramCount}`);
      values.push(ccPhoneNumber);
      paramCount++;
      this.ccPhoneNumber = ccPhoneNumber;
    }

    if (ccMail !== undefined) {
      updates.push(`cc_mail = $${paramCount}`);
      values.push(ccMail);
      paramCount++;
      this.ccMail = ccMail;
    }

    if (createdBy !== undefined) {
      updates.push(`created_by = $${paramCount}`);
      values.push(createdBy);
      paramCount++;
      this.createdBy = createdBy;
    }

    if (updates.length === 0) {
      return this;
    }

    values.push(this.ccId);
    const result = await query(
      `UPDATE "tblCaseComplainantDetails" SET ${updates.join(', ')} WHERE cc_id = $${paramCount} RETURNING *`,
      values
    );

    const row = result.rows[0];
    this.caseId = row.case_id;
    this.ccName = row.cc_name;
    this.ccAddress = row.cc_address;
    this.ccPhoneNumber = row.cc_phone_number;
    this.ccMail = row.cc_mail;
    this.createdBy = row.created_by;
    return this;
  }

  // Delete complainant details
  async delete() {
    await query('DELETE FROM "tblCaseComplainantDetails" WHERE cc_id = $1', [this.ccId]);
    return true;
  }
}

module.exports = CaseComplainantDetails;

