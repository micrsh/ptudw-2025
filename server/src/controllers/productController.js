const controller = {};
const {Product} = require('../models');

controller.getAllProducts = (req, res) => {
  res.send("Get All Products");
};

controller.getProductById = (req, res) => {
  res.send(`Get Product with ID: ${req.params.id}`);
};

controller.createProduct = (req, res) => {
  res.send("Create a New Product");
};

controller.updateProduct = (req, res) => {
  res.send(`Update Product with ID: ${req.params.id}`);
};

controller.deleteProduct = (req, res) => {
  res.send(`Delete Product with ID: ${req.params.id}`);
};

module.exports = controller;