const controller = {};
const { Product, Category } = require('../models');
const ApiResponse = require('../utils/ApiResponse');

controller.getAllCategories = async (req, res) => {
    const options = {
        attributes: ['id', 'name'],
        include: [{ model: Product, attributes: ['id'] }],
    };
    const categories = await Category.findAll(options);
    res.status(200).json(new ApiResponse(200, categories, "Lay danh sach danh muc san pham"))
};

module.exports = controller;