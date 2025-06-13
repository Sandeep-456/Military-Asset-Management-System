const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/', (req, res) => {
  db.all('SELECT * FROM assignments', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  const { assetType, assetId, personnelId, assignmentDate, base, purpose, expectedReturnDate } = req.body;
  db.run(`INSERT INTO assignments (assetType, assetId, personnelId, assignmentDate, base, purpose, expectedReturnDate)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [assetType, assetId, personnelId, assignmentDate, base, purpose, expectedReturnDate],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    });
});

module.exports = router;
