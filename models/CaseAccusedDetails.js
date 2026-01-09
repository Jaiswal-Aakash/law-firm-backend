const { query } = require('../config/database');

// CaseAccusedDetails Model with PostgreSQL integration
class CaseAccusedDetails {
  constructor(caId, caseId, caName, caPhoneNumber, caEmail, caAddress, accusedNo, caSignaturePath, createdOn, createdBy) {
    this.caId = caId;
    this.caseId = caseId;
    this.caName = caName;
    this.caPhoneNumber = caPhoneNumber;
    this.caEmail = caEmail;
    this.caAddress = caAddress;
    this.accusedNo = accusedNo;
    this.caSignaturePath = caSignaturePath;
    this.createdOn = createdOn || new Date();
    this.createdBy = createdBy || null;
  }

  // Convert to JSON
  toJSON() {
    return {
      caId: this.caId,
      caseId: this.caseId,
      caName: this.caName,
      caPhoneNumber: this.caPhoneNumber,
      caEmail: this.caEmail,
      caAddress: this.caAddress,
      accusedNo: this.accusedNo,
      caSignaturePath: this.caSignaturePath,
      createdOn: this.createdOn,
      createdBy: this.createdBy
    };
  }

  // Get all accused details
  static async findAll() {
    const result = await query(
      'SELECT * FROM "tblCaseAccusedDetails" ORDER BY created_on DESC'
    );
    
    console.log('findAll - Number of rows:', result.rows.length);
    if (result.rows.length > 0) {
      console.log('findAll - First row sample:', JSON.stringify(result.rows[0], null, 2));
    }
    
    return result.rows.map(row => {
      return new CaseAccusedDetails(
        row.ca_id,
        row.case_id,
        row.ca_name,
        row.ca_phone_number,
        row.ca_email,
        row.ca_address,
        row.accused_no,
        row.ca_signature_path,
        row.created_on,
        row.created_by
      );
    });
  }

  // Find accused details by ID
  static async findById(caId) {
    const result = await query(
      'SELECT * FROM "tblCaseAccusedDetails" WHERE ca_id = $1',
      [caId]
    );
    if (result.rows.length === 0) {
      return null;
    }
    const row = result.rows[0];
    return new CaseAccusedDetails(
      row.ca_id,
      row.case_id,
      row.ca_name,
      row.ca_phone_number,
      row.ca_email,
      row.ca_address,
      row.accused_no,
      row.ca_signature_path,
      row.created_on,
      row.created_by
    );
  }

  // Find accused details by case_id
  static async findByCaseId(caseId) {
    const result = await query(
      'SELECT * FROM "tblCaseAccusedDetails" WHERE case_id = $1 ORDER BY created_on DESC',
      [caseId]
    );
    return result.rows.map(row => new CaseAccusedDetails(
      row.ca_id,
      row.case_id,
      row.ca_name,
      row.ca_phone_number,
      row.ca_email,
      row.ca_address,
      row.accused_no,
      row.ca_signature_path,
      row.created_on,
      row.created_by
    ));
  }

  // Find accused details by accused_no
  static async findByAccusedNo(accusedNo) {
    const result = await query(
      'SELECT * FROM "tblCaseAccusedDetails" WHERE accused_no = $1',
      [accusedNo]
    );
    if (result.rows.length === 0) {
      return null;
    }
    const row = result.rows[0];
    return new CaseAccusedDetails(
      row.ca_id,
      row.case_id,
      row.ca_name,
      row.ca_phone_number,
      row.ca_email,
      row.ca_address,
      row.accused_no,
      row.ca_signature_path,
      row.created_on,
      row.created_by
    );
  }

  // Find accused details by created_by
  static async findByCreatedBy(createdBy) {
    const result = await query(
      'SELECT * FROM "tblCaseAccusedDetails" WHERE created_by = $1 ORDER BY created_on DESC',
      [createdBy]
    );
    return result.rows.map(row => new CaseAccusedDetails(
      row.ca_id,
      row.case_id,
      row.ca_name,
      row.ca_phone_number,
      row.ca_email,
      row.ca_address,
      row.accused_no,
      row.ca_signature_path,
      row.created_on,
      row.created_by
    ));
  }

  // Create new accused details
  static async create(caseId, caName, caPhoneNumber, caEmail, caAddress, accusedNo, caSignaturePath, createdBy) {
    const result = await query(
      'INSERT INTO "tblCaseAccusedDetails" (case_id, ca_name, ca_phone_number, ca_email, ca_address, accused_no, ca_signature_path, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [caseId, caName, caPhoneNumber, caEmail, caAddress, accusedNo, caSignaturePath, createdBy]
    );
    const row = result.rows[0];
    return new CaseAccusedDetails(
      row.ca_id,
      row.case_id,
      row.ca_name,
      row.ca_phone_number,
      row.ca_email,
      row.ca_address,
      row.accused_no,
      row.ca_signature_path,
      row.created_on,
      row.created_by
    );
  }

  // Update accused details
  async update(caseId, caName, caPhoneNumber, caEmail, caAddress, accusedNo, caSignaturePath, createdBy) {
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (caseId !== undefined) {
      updates.push(`case_id = $${paramCount}`);
      values.push(caseId);
      paramCount++;
      this.caseId = caseId;
    }

    if (caName !== undefined) {
      updates.push(`ca_name = $${paramCount}`);
      values.push(caName);
      paramCount++;
      this.caName = caName;
    }

    if (caPhoneNumber !== undefined) {
      updates.push(`ca_phone_number = $${paramCount}`);
      values.push(caPhoneNumber);
      paramCount++;
      this.caPhoneNumber = caPhoneNumber;
    }

    if (caEmail !== undefined) {
      updates.push(`ca_email = $${paramCount}`);
      values.push(caEmail);
      paramCount++;
      this.caEmail = caEmail;
    }

    if (caAddress !== undefined) {
      updates.push(`ca_address = $${paramCount}`);
      values.push(caAddress);
      paramCount++;
      this.caAddress = caAddress;
    }

    if (accusedNo !== undefined) {
      updates.push(`accused_no = $${paramCount}`);
      values.push(accusedNo);
      paramCount++;
      this.accusedNo = accusedNo;
    }

    if (caSignaturePath !== undefined) {
      updates.push(`ca_signature_path = $${paramCount}`);
      values.push(caSignaturePath);
      paramCount++;
      this.caSignaturePath = caSignaturePath;
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

    values.push(this.caId);
    const result = await query(
      `UPDATE "tblCaseAccusedDetails" SET ${updates.join(', ')} WHERE ca_id = $${paramCount} RETURNING *`,
      values
    );

    const row = result.rows[0];
    this.caseId = row.case_id;
    this.caName = row.ca_name;
    this.caPhoneNumber = row.ca_phone_number;
    this.caEmail = row.ca_email;
    this.caAddress = row.ca_address;
    this.accusedNo = row.accused_no;
    this.caSignaturePath = row.ca_signature_path;
    this.createdBy = row.created_by;
    return this;
  }

  // Delete accused details
  async delete() {
    await query('DELETE FROM "tblCaseAccusedDetails" WHERE ca_id = $1', [this.caId]);
    return true;
  }
}

module.exports = CaseAccusedDetails;

