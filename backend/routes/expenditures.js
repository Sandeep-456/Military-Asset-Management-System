const express = require('express');
const router = express.Router();
const db = require('../db/db');

// GET all expenditures
router.get('/', (req, res) => {
  db.all('SELECT * FROM expenditures', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST a new expenditure
router.post('/', (req, res) => {
  const { assetType, quantityExpended, expenditureDate, base, reason, reportedBy } = req.body;

  db.run(
    `INSERT INTO expenditures (
      assetType, quantityExpended, expenditureDate, base, reason, reportedBy
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [assetType, quantityExpended, expenditureDate, base, reason, reportedBy],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

module.exports = router;
