const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || err.status || 500;


    const errorResponse = {
        statusCode: statusCode,
        message: err.message || 'An unexpected error occurred',
        data:err.data || null,
        errors: err.errors || [],
        stack: process.env.NODE_ENV === 'development' ? err.stack : '',
    };

    // Log loi ra console phia server
    console.error(err);

    // gui response loi ve client
    res.status(statusCode).json(errorResponse);
}

module.exports = errorHandler;