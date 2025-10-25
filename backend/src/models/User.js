import db from '../config/database.js';

class User {
  /**
   * Find user by ID
   */
  static findById(id) {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
  }

  /**
   * Find user by email
   */
  static findByEmail(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  }

  /**
   * Get all users
   */
  static findAll() {
    const stmt = db.prepare('SELECT id, name, email, role, created_at FROM users');
    return stmt.all();
  }

  /**
   * Get users by role
   */
  static findByRole(role) {
    const stmt = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE role = ?');
    return stmt.all(role);
  }

  /**
   * Create new user
   */
  static create({ name, email, password_hash, role }) {
    const stmt = db.prepare(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(name, email, password_hash, role);
    return this.findById(result.lastInsertRowid);
  }

  /**
   * Update user
   */
  static update(id, { name, email, role }) {
    const stmt = db.prepare(`
      UPDATE users
      SET name = COALESCE(?, name),
          email = COALESCE(?, email),
          role = COALESCE(?, role)
      WHERE id = ?
    `);
    stmt.run(name, email, role, id);
    return this.findById(id);
  }

  /**
   * Delete user
   */
  static delete(id) {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  /**
   * Count users
   */
  static count() {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM users');
    return stmt.get().count;
  }
}

export default User;
