const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

// Cau hinh CORS cho phep truy cap tu cac nguon khac
app.use(cors());

// Cau hinh Morgan de log cac yeu cau HTTP
app.use(morgan('dev'));

// Cau hinh de phan tich cac yeu cau voi JSON payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cau hinh cac route
app.use('/api/v1', require('./routes'));

// Xu ly loi tap trung
// loi 404 - Not Found
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// Xu ly loi toan cuc
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);


module.exports = app;