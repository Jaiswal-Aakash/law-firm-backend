const { query } = require('../config/database');

// LawFirm Model - Uses existing table: tblLawFirmDetails
// Columns: l_id (PK), l_name, l_designation, l_address, l_phone_number, l_email, created_on, created_by
class LawFirm {
  constructor(data) {
    this.l_id = data.l_id;
    this.l_name = data.l_name;
    this.l_designation = data.l_designation;
    this.l_address = data.l_address;
    this.l_phone_number = data.l_phone_number;
    this.l_email = data.l_email;
    this.created_on = data.created_on || new Date();
    this.created_by = data.created_by;
  }

  // Convert to JSON (using snake_case to match frontend expectations)
  toJSON() {
    return {
      l_id: this.l_id,
      l_name: this.l_name,
      l_designation: this.l_designation,
      l_address: this.l_address,
      l_phone_number: this.l_phone_number,
      l_email: this.l_email,
      created_on: this.created_on,
      created_by: this.created_by
    };
  }

  // Get all law firms
  static async findAll() {
    const result = await query('SELECT * FROM "tblLawFirmDetails" ORDER BY l_name ASC');
    return result.rows.map(row => new LawFirm(row));
  }

  // Search law firms by name
  static async searchByName(searchTerm) {
    const result = await query(
      'SELECT * FROM "tblLawFirmDetails" WHERE LOWER(l_name) LIKE LOWER($1) ORDER BY l_name ASC',
      [`%${searchTerm}%`]
    );
    return result.rows.map(row => new LawFirm(row));
  }

  // Find law firm by ID
  static async findById(id) {
    const result = await query('SELECT * FROM "tblLawFirmDetails" WHERE l_id = $1', [id]);
    if (result.rows.length === 0) {
      return null;
    }
    return new LawFirm(result.rows[0]);
  }

  // Find law firm by name
  static async findByName(firmName) {
    const result = await query('SELECT * FROM "tblLawFirmDetails" WHERE LOWER(l_name) = LOWER($1)', [firmName]);
    if (result.rows.length === 0) {
      return null;
    }
    return new LawFirm(result.rows[0]);
  }

  // Create new law firm
  static async create(firmData, createdBy = null) {
    const { l_name, l_designation, l_address, l_phone_number, l_email } = firmData;
    const result = await query(
      `INSERT INTO "tblLawFirmDetails" (l_name, l_designation, l_address, l_phone_number, l_email, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [l_name, l_designation || null, l_address || null, l_phone_number || null, l_email || null, createdBy]
    );
    return new LawFirm(result.rows[0]);
  }

  // Delete law firm
  async delete() {
    await query('DELETE FROM "tblLawFirmDetails" WHERE l_id = $1', [this.l_id]);
    return true;
  }

  // Get advocates for a firm (from tblUsers where law_firm = l_id)
  static async getAdvocatesByFirmId(firmId) {
    const result = await query(
      `SELECT u.*, l.l_name as firm_name
       FROM "tblUsers" u
       LEFT JOIN "tblLawFirmDetails" l ON u.law_firm = l.l_id
       WHERE u.law_firm = $1
       ORDER BY u.name ASC`,
      [firmId]
    );
    return result.rows.map(row => ({
      id: row.user_id,
      name: row.name,
      email: row.email,
      phone: row.phone_number,
      address: row.address,
      lawFirm: row.law_firm,
      firmName: row.firm_name,
      status: row.status || 'Pending', // Default to Pending if NULL
      emailVerified: Boolean(row.email_verified), // Include email verification status (handles true, 'true', 1, etc.)
      createdAt: row.created_on,
      createdBy: row.created_by
    }));
  }
}

module.exports = LawFirm;

