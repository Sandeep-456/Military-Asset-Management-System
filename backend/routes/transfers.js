const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/', (req, res) => {
  db.all('SELECT * FROM transfers', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  const { assetType, assetId, quantity, sourceBase, destinationBase, transferDate, reason, approvingAuthority, remarks } = req.body;
  db.run(`INSERT INTO transfers (assetType, assetId, quantity, sourceBase, destinationBase, transferDate, reason, approvingAuthority, remarks, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
    [assetType, assetId, quantity, sourceBase, destinationBase, transferDate, reason, approvingAuthority, remarks],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    });
});

module.exports = router;
