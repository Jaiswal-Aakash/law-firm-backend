const { query } = require('../config/database');
const bcrypt = require('bcrypt');

// User Model with PostgreSQL integration
class User {
  constructor(data) {
    this.user_id = data.user_id;
    this.name = data.name;
    this.email = data.email;
    this.phone_number = data.phone_number;
    this.address = data.address;
    this.law_firm = data.law_firm;
    this.password = data.password; // Hashed password
    this.created_on = data.created_on || new Date();
    this.created_by = data.created_by;
    this.reset_token = data.reset_token;
    this.reset_token_expiry = data.reset_token_expiry;
    this.verification_token = data.verification_token;
    this.verification_token_expiry = data.verification_token_expiry;
    this.email_verified = data.email_verified || false;
    this.status = data.status || 'Pending'; // Default to 'Pending' for admin activation
  }

  // Convert to JSON (exclude password and tokens)
  toJSON() {
    return {
      user_id: this.user_id,
      name: this.name,
      email: this.email,
      phone_number: this.phone_number,
      address: this.address,
      law_firm: this.law_firm,
      created_on: this.created_on,
      created_by: this.created_by,
      email_verified: this.email_verified,
      status: this.status
    };
  }

  // Get all users
  static async findAll() {
    const result = await query('SELECT * FROM "tblUsers" ORDER BY created_on DESC');
    return result.rows.map(row => new User(row));
  }

  // Find user by ID
  static async findById(id) {
    const result = await query('SELECT * FROM "tblUsers" WHERE user_id = $1', [id]);
    if (result.rows.length === 0) {
      return null;
    }
    return new User(result.rows[0]);
  }

  // Find user by email
  static async findByEmail(email) {
    const result = await query('SELECT * FROM "tblUsers" WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return null;
    }
    return new User(result.rows[0]);
  }

  // Find user by verification token
  static async findByVerificationToken(token) {
    const result = await query(
      'SELECT * FROM "tblUsers" WHERE verification_token = $1 AND verification_token_expiry > NOW()',
      [token]
    );
    if (result.rows.length === 0) {
      return null;
    }
    return new User(result.rows[0]);
  }

  // Create new user with password hashing
  static async create(userData) {
    const { name, email, phone_number, address, law_firm, password, created_by, status, email_verified } = userData;
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Default status to 'Pending' for admin activation (must match check constraint)
    const userStatus = status || 'Pending';
    const isEmailVerified = email_verified || false;
    
    const result = await query(
      `INSERT INTO "tblUsers" (name, email, phone_number, address, law_firm, password, created_by, status, email_verified) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [name, email, phone_number || null, address || null, law_firm || null, hashedPassword, created_by || null, userStatus, isEmailVerified]
    );
    return new User(result.rows[0]);
  }

  // Verify password
  async verifyPassword(plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
  }

  // Update user
  async update(updateData) {
    const { name, email, phone_number, address, law_firm } = updateData;
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (email !== undefined) {
      updates.push(`email = $${paramCount++}`);
      values.push(email);
    }
    if (phone_number !== undefined) {
      updates.push(`phone_number = $${paramCount++}`);
      values.push(phone_number);
    }
    if (address !== undefined) {
      updates.push(`address = $${paramCount++}`);
      values.push(address);
    }
    if (law_firm !== undefined) {
      updates.push(`law_firm = $${paramCount++}`);
      values.push(law_firm);
    }

    if (updates.length === 0) {
      return this;
    }

    values.push(this.user_id);
    const queryText = `UPDATE "tblUsers" SET ${updates.join(', ')} WHERE user_id = $${paramCount} RETURNING *`;
    
    const result = await query(queryText, values);
    const row = result.rows[0];
    
    // Update instance properties
    Object.assign(this, new User(row));
    return this;
  }

  // Set verification token
  async setVerificationToken(token, expiryHours = 24) {
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + expiryHours);
    
    await query(
      'UPDATE "tblUsers" SET verification_token = $1, verification_token_expiry = $2 WHERE user_id = $3',
      [token, expiry, this.user_id]
    );
    
    this.verification_token = token;
    this.verification_token_expiry = expiry;
    return this;
  }

  // Verify email
  async verifyEmail() {
    await query(
      'UPDATE "tblUsers" SET email_verified = TRUE, verification_token = NULL, verification_token_expiry = NULL WHERE user_id = $1',
      [this.user_id]
    );
    
    this.email_verified = true;
    this.verification_token = null;
    this.verification_token_expiry = null;
    return this;
  }

  // Delete user
  async delete() {
    await query('DELETE FROM "tblUsers" WHERE user_id = $1', [this.user_id]);
    return true;
  }
}

module.exports = User;
