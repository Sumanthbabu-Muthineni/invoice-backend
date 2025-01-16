module.exports = {
    INVOICE_STATUS: {
      PAID: 'paid',
      UNPAID: 'unpaid',
      PENDING: 'pending'
    },
    
    ROUTES: {
      AUTH: {
        REGISTER: '/api/auth/register',
        LOGIN: '/api/auth/login',
        ME: '/api/auth/me'
      },
      INVOICES: {
        BASE: '/api/invoices',
        SINGLE: '/api/invoices/:id',
        FILTER: '/api/invoices/filter/:status',
        SEARCH: '/api/invoices/search',
        STATS: '/api/invoices/stats/summary'
      }
    },
  
    ERROR_MESSAGES: {
      AUTH: {
        INVALID_CREDENTIALS: 'Invalid credentials',
        USER_EXISTS: 'User already exists',
        NOT_AUTHORIZED: 'Not authorized to access this route'
      },
      INVOICE: {
        NOT_FOUND: 'Invoice not found',
        INVALID_STATUS: 'Invalid invoice status'
      },
      SERVER_ERROR: 'Server Error'
    }
  };