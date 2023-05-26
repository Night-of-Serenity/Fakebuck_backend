const { User } = require("../models");
const { Op } = require("sequelize");

exports.checkEmailOrMobileExist = (emailOrMobile) => {
  return User.findOne({
    where: {
      [Op.or]: [{ email: emailOrMobile }, { mobile: emailOrMobile }],
    },
  });
};
