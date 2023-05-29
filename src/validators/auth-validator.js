const Joi = require("joi");
const validate = require("./validate");

const registerSchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  emailOrMobile: Joi.alternatives([
    Joi.string().email({ tlds: false }),
    Joi.string().pattern(/^[0-9]{10}$/),
  ]).strip(),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{6,30}$/)
    .trim()
    .required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .trim()
    .required()
    .strip(),
  email: Joi.forbidden().when("emailOrMobile", {
    is: Joi.string().email({ tlds: false }),
    then: Joi.string().default(Joi.ref("emailOrMobile")),
  }),
  mobile: Joi.forbidden().when("emailOrMobile", {
    is: Joi.string().pattern(/^[0-9]{10}$/),
    then: Joi.string().default(Joi.ref("emailOrMobile")),
  }),
});

const loginSchema = Joi.object({
  emailOrMobile: Joi.string().required(),
  password: Joi.string().required(),
});

exports.validateRegister = validate(registerSchema);
exports.validateLogin = validate(loginSchema);
