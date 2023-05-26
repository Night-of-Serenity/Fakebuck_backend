const { validateRegister } = require("../validators/auth-validator");
const userService = require("../services/user-service");
const createError = require("../utils/create-error");
exports.register = async (req, res, next) => {
  try {
    // 1.validate
    const value = validateRegister(req.body);
    const isUserExist = await userService.checkEmailOrMobileExist(value.email || value.mobile);
    if (isUserExist) {
      createError("email address or mobile number already in use");
    }

    // 2.hash password
    // 3.insert to users table
    // 4.sign token and send response
  } catch (err) {
    next(err);
  }
};
