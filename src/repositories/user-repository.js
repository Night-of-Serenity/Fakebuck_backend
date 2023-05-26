const { User } = require("../models");
const { Op } = require("sequelize");

exports.getUserByEmailOrMobile = (emailOrMobile) => {
  return User.findOne({
    where: {
      [Op.or]: [{ email: emailOrMobile }, { mobile: emailOrMobile }],
    },
  });
};

exports.createUser = (user) => User.create(user);
