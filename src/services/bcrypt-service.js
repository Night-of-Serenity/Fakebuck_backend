const bcrypt = require("bcryptjs");

exports.hash = (password) => bcrypt.hash(password, +process.env.HASH_SALT);
