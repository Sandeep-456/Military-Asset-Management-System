const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Helper to generate WHERE clause and bind values
const buildFilters = (query) => {
  const clauses = [];
  const values = [];

  if (query.fromDate && query.toDate) {
    clauses.push(`date >= ? AND date <= ?`);
    values.push(query.fromDate, query.toDate);
  }

  if (query.equipmentType) {
    clauses.push(`LOWER(assetType) = LOWER(?)`);
    values.push(query.equipmentType.trim());
  }

  if (query.base) {
    const baseValue = query.base.trim().toLowerCase();
    clauses.push(`(LOWER(base) = ? OR LOWER(receivingBase) = ? OR LOWER(sourceBase) = ? OR LOWER(destinationBase) = ?)`);
    values.push(baseValue, baseValue, baseValue, baseValue);
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  return { where, values };
};

// Helper to replace generic 'date' keyword with table-specific date column
const getWhere = (where, field) => where.replace(/date/g, field);

// === GET /api/dashboard ===
router.get('/', (req, res) => {
  const filters = req.query;
  const stats = {};
  const { where, values } = buildFilters(filters);

  // Debug logs
  console.log('Filters:', filters);
  console.log('WHERE:', where);
  console.log('VALUES:', values);

  db.serialize(() => {
    db.get(`SELECT SUM(quantity) as totalPurchased FROM purchases ${getWhere(where, 'purchaseDate')}`, values, (err, row) => {
      stats.totalPurchased = row?.totalPurchased || 0;

      db.get(`SELECT COUNT(*) as totalAssigned FROM assignments ${getWhere(where, 'assignmentDate')}`, values, (err, row) => {
        stats.totalAssigned = row?.totalAssigned || 0;

        db.get(`SELECT SUM(quantityExpended) as totalExpended FROM expenditures ${getWhere(where, 'expenditureDate')}`, values, (err, row) => {
          stats.totalExpended = row?.totalExpended || 0;

          db.get(`SELECT COUNT(*) as totalTransfers FROM transfers ${getWhere(where, 'transferDate')}`, values, (err, row) => {
            stats.totalTransfers = row?.totalTransfers || 0;

            db.all(`SELECT assetType, SUM(quantity) as quantity FROM purchases ${getWhere(where, 'purchaseDate')} GROUP BY assetType`, values, (err, rows) => {
              stats.purchaseSummary = rows || [];

              db.all(`SELECT receivingBase as base, COUNT(*) as count FROM purchases ${getWhere(where, 'purchaseDate')} GROUP BY receivingBase`, values, (err, pieRows) => {
                stats.baseSummary = pieRows || [];

                const opening = 10000;
                const closing = opening + stats.totalPurchased - stats.totalExpended;
                stats.openingBalance = opening;
                stats.closingBalance = closing;
                stats.netMovement = closing - opening;

                res.json(stats);
              });
            });
          });
        });
      });
    });
  });
});

// === GET /api/dashboard/details ===
router.get('/details', (req, res) => {
  const filters = req.query;
  const { where, values } = buildFilters(filters);
  const base = filters.base?.trim().toLowerCase() || '';
  const response = { purchases: [], transfersIn: [], transfersOut: [] };

  db.all(`SELECT * FROM purchases ${getWhere(where, 'purchaseDate')}`, values, (err, rows) => {
    response.purchases = rows || [];

    db.all(
      `SELECT * FROM transfers ${getWhere(where, 'transferDate')} AND LOWER(destinationBase) = ?`,
      [...values, base],
      (err, inRows) => {
        response.transfersIn = inRows || [];

        db.all(
          `SELECT * FROM transfers ${getWhere(where, 'transferDate')} AND LOWER(sourceBase) = ?`,
          [...values, base],
          (err, outRows) => {
            response.transfersOut = outRows || [];
            res.json(response);
          }
        );
      }
    );
  });
});

module.exports = router;
