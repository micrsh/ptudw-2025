const controller = {};
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { User } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

controller.register = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword, phoneNumber } = req.body;

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    throw new ApiError(400, 'Thieu thong tin bat buoc');
  }

  if (password !== confirmPassword) {
    throw new ApiError(400, 'Mat khau va xac nhan mat khau khong khop');
  }

  if (password.length < 6) {
    throw new ApiError(400, 'Mat khau phai co it nhat 6 ky tu');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, 'Email khong hop le');
  }

  const emailExists = await User.findOne({ where: { email } });
  if (emailExists) {
    throw new ApiError(400, 'Email da ton tai');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = await User.create({ firstName, lastName, email, password: hashedPassword, phoneNumber, role: 'User' });

  const userResponse = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
  };

  res.status(201).json(new ApiResponse(201, userResponse));
};

module.exports = controller;