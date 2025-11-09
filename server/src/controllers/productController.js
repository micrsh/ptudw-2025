const controller = {};
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { Image, Product, Category, Tag, Review, User } = require("../models");
const { Op } = require("sequelize");

controller.getAllProducts = async (req, res) => {
  let {
    search,
    categoryId,
    tagId,
    minPrice,
    maxPrice,
    page = 1,
    limit = 6,
    sort = "newest"
  } = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;

  let options = {
    where: {},
    limit: limitNum,
    offset: offset,
    include: [
      { model: Category, adtributes: ["id", "name"] },
      {
        model: Tag,
        through: { attributes: [] },
        attributes: ["id", "name"],
        required: false,
      },
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
  options.where.price = {};
  if (minPrice) {
    if (isNaN(minPrice)) {
      return new ApiError(400, "MinPrice must be a number");
    }
    minPrice = parseFloat(minPrice);
    options.where.price[Op.gte] = minPrice;
  }

  if (maxPrice) {
    if (isNaN(maxPrice)) {
      return new ApiError(400, "MaxPrice must be a number");
    }
    maxPrice = parseFloat(maxPrice);
    options.where.price[Op.lte] = maxPrice;
  }

  // sort theo name, price, createdAt
  const validSortFields = {
    "newest": { sortBy: "createdAt", sortOrder: "desc" },
    "price_asc": { sortBy: "price", sortOrder: "asc" },
    "price_desc": { sortBy: "price", sortOrder: "desc" },
    "name_asc": { sortBy: "name", sortOrder: "asc" },
    "name_desc": { sortBy: "name", sortOrder: "desc" },
  }

  if (Object.keys(validSortFields).includes(sort)) {
    const validSort = validSortFields[sort];
    options.order = [[validSort.sortBy, validSort.sortOrder]];
  } else {
    options.order = [["createdAt", "desc"]];
  }

  // truy van san pham
  let product = await Product.findAndCountAll(options);

  // Kiem tra neu khong co san pham nao
  if (!product || product.length === 0) {
    return new ApiError(404, "No products found");
  }

  // Tra ve danh sach san pham
  const responseData = {
    products: product.rows,
    pagination: {
      totalItems: product.count,
      totalPages: Math.ceil(product.count / limitNum),
      currentPage: pageNum,
      limit: limitNum,
    },
    filter: {
      search: search || "",
      categoryId: categoryId || null,
      tagId: tagId || null,
      minPrice: minPrice || null,
      maxPrice: maxPrice || null,
      limit: limitNum,
      page: pageNum,
      sort: sort
    },
  };

  res
    .status(200)
    .json(
      new ApiResponse(200, responseData, "Products retrieved successfully")
    );
};

controller.getProductById = async (req, res) => {
  let { id } = req.params;
  if (isNaN(id)) {
    throw new ApiError(400, "ID phai la so nguyen");
  }
  id = parseInt(id);
  const product = await Product.findByPk(id, {
    include: [
      { model: Image, attributes: ["id", "imagePath", "altText"] },
      { model: Category, attributes: ["id", "name"] },
      {
        model: Tag,
        through: { attributes: [] },
        attributes: ["id", "name"],
        required: false,
      },
      {
        model: Review,
        attributes: ["id", "rating", "comment", "createdAt"],
        include: [
          {
            model: User,
            attributes: ["firstName", "lastName", "profileImage"],
          }
        ]
      },
    ],
  });
  if (!product) {
    throw new ApiError(404, "San pham khong ton tai");
  }

  product.Reviews
  res
    .status(200)
    .json(new ApiResponse(200, product, "San pham lay thanh cong"));
};

controller.createProduct = async (req, res) => {
  const { name, price, summary, description, categoryId, tagIds } = req.body;
  if (!name || !price || !categoryId) {
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
    categoryId: parseInt(categoryId),
  });

  // If tagIds are provided, associate them with the product
  if (tagIds && Array.isArray(tagIds)) {
    await newProduct.setTags(tagIds);
  }

  res
    .status(201)
    .json(new ApiResponse(201, "San pham tao thanh cong", newProduct));
};

controller.updateProduct = async (req, res) => {
  let { id } = req.params;
  const { name, price, description, categoryId } = req.body;

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
  res
    .status(200)
    .json(new ApiResponse(200, "San pham cap nhat thanh cong", product));
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
  res
    .status(200)
    .json(new ApiResponse(200, "San pham xoa thanh cong", product));
};

module.exports = controller;
