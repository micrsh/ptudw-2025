const express = require('express');
const router = express.Router();
const productRouter = require('./productRouter');
const authRouter = require('./authRouter');
const categoriesRouter = require('./categoryRouter');

router.use('/products', productRouter);
router.use('/categories', categoriesRouter);
router.use('/auth', authRouter);


module.exports = router;