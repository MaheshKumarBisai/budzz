// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = {
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  // Specific error handling
  if (err.name === 'ValidationError') {
    error.message = 'Validation Error';
    error.details = err.details;
    return res.status(400).json(error);
  }

  if (err.code === '23505') { // PostgreSQL unique violation
    error.message = 'Duplicate entry. Resource already exists';
    return res.status(409).json(error);
  }

  if (err.code === '23503') { // Foreign key violation
    error.message = 'Referenced resource not found';
    return res.status(404).json(error);
  }

  if (err.code === '22P02') { // Invalid input syntax
    error.message = 'Invalid input data';
    return res.status(400).json(error);
  }

  res.status(err.statusCode || 500).json(error);
};

// 404 handler
const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound };
