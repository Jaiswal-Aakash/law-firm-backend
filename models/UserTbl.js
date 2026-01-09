const { query } = require('../config/database');
const bcrypt = require('bcrypt');

// UserTbl Model - Uses existing table: tblUsers
// Columns: user_id (PK), name, email, phone_number, address, law_firm (FK → tblLawFirmDetails.l_id), 
//          password, status, created_on, created_by, reset_token, reset_token_expiry, etc.
class UserTbl {
  constructor(userId, name, email, phoneNumber, address, lawFirm, password, createdOn, createdBy, resetToken, resetTokenExpiry, status) {
    this.userId = userId;
    this.name = name;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.lawFirm = lawFirm;
    this.password = password;
    this.createdOn = createdOn;
    this.createdBy = createdBy;
    this.resetToken = resetToken;
    this.resetTokenExpiry = resetTokenExpiry;
    this.status = status || 'Pending';
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.userId,
      name: this.name,
      email: this.email,
      phone: this.phoneNumber,
      address: this.address,
      lawFirm: this.lawFirm,
      status: this.status || 'Pending', // Include status field
      createdAt: this.createdOn,
      createdBy: this.createdBy
    };
  }

  // Get all advocates (users from tblUsers)
  static async findAllAdvocates() {
    const result = await query(
      `SELECT u.*, l.l_name as firm_name
       FROM "tblUsers" u
       LEFT JOIN "tblLawFirmDetails" l ON u.law_firm = l.l_id
       ORDER BY l.l_name ASC NULLS LAST, u.name ASC`
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

  // Find user by ID
  static async findById(userId) {
    const result = await query('SELECT * FROM "tblUsers" WHERE user_id = $1', [userId]);
    if (result.rows.length === 0) {
      return null;
    }
    const row = result.rows[0];
    return new UserTbl(
      row.user_id,
      row.name,
      row.email,
      row.phone_number,
      row.address,
      row.law_firm,
      row.password,
      row.created_on,
      row.created_by,
      row.reset_token,
      row.reset_token_expiry,
      row.status
    );
  }

  // Update user status (for activation/deactivation)
  static async updateStatus(userId, status) {
    if (!['Pending', 'Active', 'Inactive'].includes(status)) {
      throw new Error('Invalid status. Must be Pending, Active, or Inactive');
    }
    const result = await query(
      `UPDATE "tblUsers"
       SET status = $1
       WHERE user_id = $2
       RETURNING *`,
      [status, userId]
    );
    return result.rows[0];
  }

  // Update user password (with hashing)
  static async updatePassword(userId, plainPassword) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    const result = await query(
      `UPDATE "tblUsers"
       SET password = $1
       WHERE user_id = $2
       RETURNING *`,
      [hashedPassword, userId]
    );
    return result.rows[0];
  }
}

module.exports = UserTbl;

