module.exports = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace for debugging
    res.status(500).json({
      message: err.message || 'Something went wrong!',
      error: process.env.NODE_ENV === 'development' ? err : {}, // Include error details only in development
    });
  };