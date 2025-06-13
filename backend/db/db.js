const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./military.db');
const bcrypt = require('bcryptjs');

db.serialize(() => {
  // Create all tables
  db.run(`CREATE TABLE IF NOT EXISTS expenditures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assetType TEXT,
    quantityExpended INTEGER,
    expenditureDate TEXT,
    base TEXT,
    reason TEXT,
    reportedBy TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assetType TEXT,
    model TEXT,
    quantity INTEGER,
    unitCost REAL,
    totalCost REAL,
    purchaseDate TEXT,
    supplier TEXT,
    receivingBase TEXT,
    purchaseOrderNumber TEXT,
    remarks TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS transfers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assetType TEXT,
    assetId TEXT,
    quantity INTEGER,
    sourceBase TEXT,
    destinationBase TEXT,
    transferDate TEXT,
    reason TEXT,
    approvingAuthority TEXT,
    remarks TEXT,
    status TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assetType TEXT,
    assetId TEXT,
    personnelId TEXT,
    assignmentDate TEXT,
    base TEXT,
    purpose TEXT,
    expectedReturnDate TEXT
  )`);

  // Create users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);
  db.serialize(() => {
  // Users
  const adminPass = bcrypt.hashSync('admin123', 10);
  const commanderPass = bcrypt.hashSync('commander123', 10);
  db.run(`INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)`, ['admin', adminPass]);
  db.run(`INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)`, ['commander', commanderPass]);

  // Purchases
  db.run(`INSERT INTO purchases (assetType, model, quantity, unitCost, totalCost, purchaseDate, supplier, receivingBase, purchaseOrderNumber, remarks)
    VALUES ('Rifle', 'AK-47', 100, 15000, 1500000, '2025-06-01', 'Arms Corp', 'Base Alpha', 'PO123', 'Initial purchase')`);

  // Expenditures
  db.run(`INSERT INTO expenditures (assetType, quantityExpended, expenditureDate, base, reason, reportedBy)
    VALUES ('Rifle', 10, '2025-06-03', 'Base Alpha', 'Training', 'admin')`);

  // Assignments
  db.run(`INSERT INTO assignments (assetType, assetId, personnelId, assignmentDate, base, purpose, expectedReturnDate)
    VALUES ('Rifle', 'AK-47-001', 'P001', '2025-06-05', 'Base Alpha', 'Patrol Duty', '2025-06-15')`);

  // Transfers
  db.run(`INSERT INTO transfers (assetType, assetId, quantity, sourceBase, destinationBase, transferDate, reason, approvingAuthority, remarks, status)
    VALUES ('Rifle', 'AK-47-001', 5, 'Base Alpha', 'Base Bravo', '2025-06-07', 'Reallocation', 'commander', 'Routine shift', 'Pending')`);
});

  // Insert default user (admin / admin123)
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.run(`INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)`, ['admin', hashedPassword]);
});

module.exports = db;
