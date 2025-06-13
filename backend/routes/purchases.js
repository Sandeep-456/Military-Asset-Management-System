const express = require('express');
const router = express.Router();
const db = require('../db/db');

// GET all purchases
router.get('/', (req, res) => {
  db.all('SELECT * FROM purchases', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST a new purchase (calculates totalCost on server)
router.post('/', (req, res) => {
  const {
    assetType, model, quantity, unitCost,
    purchaseDate, supplier, receivingBase,
    purchaseOrderNumber, remarks
  } = req.body;

  const totalCost = quantity * unitCost; // ✅ Auto-calculation

  db.run(
    `INSERT INTO purchases (
      assetType, model, quantity, unitCost, totalCost,
      purchaseDate, supplier, receivingBase, purchaseOrderNumber, remarks
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      assetType, model, quantity, unitCost, totalCost,
      purchaseDate, supplier, receivingBase, purchaseOrderNumber, remarks
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

module.exports = router;
