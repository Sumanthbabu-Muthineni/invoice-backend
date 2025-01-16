const jwt = require('jsonwebtoken');

// Generate JWT Token
exports.generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Format Error Response
exports.errorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message
  });
};

// Format Success Response
exports.successResponse = (res, statusCode, data) => {
  return res.status(statusCode).json({
    success: true,
    data
  });
};

// Generate Invoice Number
exports.generateInvoiceNumber = (prefix = 'INV') => {
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${year}${month}-${random}`;
};

// Calculate Invoice Statistics
exports.calculateInvoiceStats = (invoices) => {
  return invoices.reduce((stats, invoice) => {
    stats.totalAmount += invoice.amount;
    stats.totalCount += 1;
    
    if (invoice.status === 'paid') {
      stats.paidAmount += invoice.amount;
      stats.paidCount += 1;
    } else {
      stats.unpaidAmount += invoice.amount;
      stats.unpaidCount += 1;
    }
    
    return stats;
  }, {
    totalAmount: 0,
    paidAmount: 0,
    unpaidAmount: 0,
    totalCount: 0,
    paidCount: 0,
    unpaidCount: 0
  });
};