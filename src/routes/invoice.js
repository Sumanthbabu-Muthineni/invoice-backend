const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validateRequest } = require('../middleware/validation');
const { protect } = require('../middleware/auth');
const {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice
} = require('../controllers/invoiceController');
const Invoice = require('../models/Invoice'); // Add this at the top


// Protect all routes
router.use(protect);

// Get all invoices & Create invoice
router.route('/')
  .get(getInvoices)
  .post([
    check('invoiceNumber', 'Invoice number is required').not().isEmpty(),
    check('clientName', 'Client name is required').not().isEmpty(),
    check('amount', 'Amount is required and must be a number').isNumeric(),
    check('status', 'Status must be either paid, unpaid, or pending').isIn(['paid', 'unpaid', 'pending']),
    check('date', 'Date is required').not().isEmpty()
  ],
  validateRequest,
  createInvoice
);

// Get, update and delete specific invoice
router.route('/:id')
  .get(getInvoice)
  .put([
    check('invoiceNumber', 'Invoice number is required').optional().not().isEmpty(),
    check('clientName', 'Client name is required').optional().not().isEmpty(),
    check('amount', 'Amount must be a number').optional().isNumeric(),
    check('status', 'Status must be either paid, unpaid, or pending')
      .optional()
      .isIn(['paid', 'unpaid', 'pending']),
    check('date', 'Please enter a valid date').optional().isDate()
  ],
  validateRequest,
  updateInvoice)
  .delete(deleteInvoice);

// Additional routes for filtering and statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await Invoice.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          averageAmount: { $avg: '$amount' },
          totalInvoices: { $sum: 1 },
          paidInvoices: {
            $sum: { $cond: [{ $eq: ['$status', 'paid'] }, 1, 0] }
          },
          unpaidAmount: {
            $sum: {
              $cond: [{ $ne: ['$status', 'paid'] }, '$amount', 0]
            }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: stats[0] || {
        totalAmount: 0,
        averageAmount: 0,
        totalInvoices: 0,
        paidInvoices: 0,
        unpaidAmount: 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// Filter invoices by status
router.get('/filter/:status', [
  check('status', 'Status must be either paid, unpaid, or pending').isIn(['paid', 'unpaid', 'pending']),
  validateRequest
], async (req, res) => {
  try {
    const invoices = await Invoice.find({
      user: req.user.id,
      status: req.params.status
    }).sort({ date: -1 });

    res.json({
      success: true,
      count: invoices.length,
      data: invoices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// Search invoices by client name or invoice number
router.get('/search', [
  check('query', 'Search query is required').not().isEmpty(),
  validateRequest
], async (req, res) => {
  try {
    const searchQuery = new RegExp(req.query.query, 'i');
    const invoices = await Invoice.find({
      user: req.user.id,
      $or: [
        { clientName: searchQuery },
        { invoiceNumber: searchQuery }
      ]
    }).sort({ date: -1 });

    res.json({
      success: true,
      count: invoices.length,
      data: invoices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

module.exports = router;