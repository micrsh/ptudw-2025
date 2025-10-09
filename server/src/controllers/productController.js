const controller = {};
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { Product, Category, Tag } = require('../models');
const { Op } = require('sequelize');

controller.getAllProducts = async (req, res) => {
  let { search, categoryId, tagId, minPrice, maxPrice, page = 1, limit = 10, sortBy = 'price', sortOrder = 'asc' } = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;

  let options = {
    where: {},
    limit: limitNum,
    offset: offset,
    order: [[sortBy, sortOrder]],
    include: [
      { model: Category, adtributes: ['id', 'name'] },
      { model: Tag, through: { attributes: [] }, attributes: ['id', 'name'], required: false },
    ],
    distinct: true, // Dam bao khong lay trung data
  };

  // Loc theo search
  if (search) {
    options.where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
      { summary: { [Op.iLike]: `%${search}%` } },
    ];
  }

  // Loc theo categoryId
  if (categoryId) {
    if (isNaN(categoryId)) {
      return new ApiError(400, "CategoryId must be a number");
    }
    categoryId = parseInt(categoryId);
    options.where.categoryId = categoryId;
  }

  // Loc theo tagId
  if (tagId) {
    if (isNaN(tagId)) {
      return new ApiError(400, "TagId must be a number");
    }
    tagId = parseInt(tagId);
    options.include[1].where = { id: tagId };
    options.include[1].required = true; // Chi lay nhung san pham co tagId
  }

  // Loc theo khoang gia
  if (maxPrice) {
    if (isNaN(maxPrice)) {
      return new ApiError(400, "MaxPrice must be a number");
    }
    maxPrice = parseFloat(maxPrice);
    options.where.price = { [Op.gte]: maxPrice };
  }

  // sort theo name, price, createdAt
  const validSortFields = ['name', 'price', 'createdAt'];
  const validSortOrder = ['asc', 'desc'];

  if (validSortFields.includes(sortBy) && validSortOrder.includes(sortOrder)) {
    options.order = [[sortBy, sortOrder]];
  } else {
    sortBy = 'price';
    sortOrder = 'asc';
    options.order = [['price', 'asc']];
  }

  // truy van san pham 
  let product = await Product.findAndCountAll(options);

  // Kiem tra neu khong co san pham nao
  if (!product || product.length === 0) {
    return new ApiError(404, "No products found");
  }

  // Tra ve danh sach san pham
  const responseData = {
    products: product,
    pagination: {
      totalItems: product.count,
      totalPages: Math.ceil(product.count / limitNum),
      currentPage: pageNum,
      limit: limitNum,
    },
    filter: {
      search: search || '',
      categoryId: categoryId || null,
      tagId: tagId || null,
      minPrice: minPrice || null,
      maxPrice: maxPrice || null,
      limit: limitNum,
      page: pageNum,
      sortBy: sortBy,
      sortOrder: sortOrder
    },
  };

  res.status(200).json(new ApiResponse(200, "Products retrieved successfully", responseData));
};

controller.getProductById = async (req, res) => {
  let { id } = req.params;
  if (isNaN(id)) {
    throw new ApiError(400, "ID phai la so nguyen");
  }
  id = parseInt(id);
  const product = await Product.findByPk(id, {
    include: [
      { model: Category, attributes: ['id', 'name'] },
      { model: Tag, through: { attributes: [] }, attributes: ['id', 'name'], required: false },
    ]
  });
  if (!product) {
    throw new ApiError(404, "San pham khong ton tai");
  }
  res.status(200).json(new ApiResponse(200, "San pham lay thanh cong", product));
};

controller.createProduct = async (req, res) => {
  const { name, price, summary, description, categoryId, tagIds } = req.body;
  if(!name || !price || !categoryId) {
    throw new ApiError(400, "Thieu thong tin san pham");
  }

  if (isNaN(price)) {
    throw new ApiError(400, "Price phai la so");
  }

  if (isNaN(categoryId)) {
    throw new ApiError(400, "CategoryId phai la so");
  }

  const newProduct = await Product.create({
    name,
    price: parseFloat(price),
    summary,
    description,
    categoryId: parseInt(categoryId)
  });

  // If tagIds are provided, associate them with the product
  if (tagIds && Array.isArray(tagIds)) {
    await newProduct.setTags(tagIds);
  }

  res.status(201).json(new ApiResponse(201, "San pham tao thanh cong", newProduct));
};

controller.updateProduct = async (req, res) => {
  let { id } = req.params;
  const { name, price, description, categoryId,} = req.body;

  if (isNaN(id)) {
    throw new ApiError(400, "ID phai la so nguyen");
  }

  id = parseInt(id);
  const product = await Product.findByPk(id);
  if (!product) {
    throw new ApiError(404, "San pham khong ton tai");
  }
  
  if (name) {
    product.name = name;
  }
  if (description) {
    product.description = description;
  }
  if (price) {
    if (isNaN(price)) {
      throw new ApiError(400, "Price phai la so");
    }
    product.price = parseFloat(price);
  }
  if (categoryId) {
    if (isNaN(categoryId)) {
      throw new ApiError(400, "CategoryId phai la so");
    }
    product.categoryId = parseInt(categoryId);
  }

  await product.save();
  res.status(200).json(new ApiResponse(200, "San pham cap nhat thanh cong", product));
};

controller.deleteProduct = async (req, res) => {
  let { id } = req.params;

  if (isNaN(id)) {
    throw new ApiError(400, "ID phai la so nguyen");
  }
  id = parseInt(id);

  const product = await Product.findByPk(id);

  if (!product) {
    throw new ApiError(404, "San pham khong ton tai");
  }

  await product.destroy();
  res.status(200).json(new ApiResponse(200, "San pham xoa thanh cong", product));
};

module.exports = controller;