const { validateRegister } = require("../validators/auth-validator");

exports.register = async (req, res, next) => {
  try {
    // 1.validate
    const { value, error } = validateRegister(req.body);
    if (error) {
      //   console.log(error);
      res.status(400).json({ message: error.details[0].message });
    }

    // 2.hash password
    // 3.insert to users table
    // 4.sign token and send response
  } catch (err) {
    next(err);
  }
};
