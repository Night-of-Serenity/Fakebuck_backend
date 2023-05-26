const { validateRegister } = require("../validators/auth-validator");

exports.register = async (req, res, next) => {
  try {
    // 1.validate
    const value = validateRegister(req.body);

    // 2.hash password
    // 3.insert to users table
    // 4.sign token and send response
  } catch (err) {
    next(err);
  }
};
