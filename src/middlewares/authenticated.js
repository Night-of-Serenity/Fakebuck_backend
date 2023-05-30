const createError = require("../utils/create-error");
const tokenService = require("../services/token-service");
const userService = require("../services/user-service");

module.exports = async (req, res, next) => {
  try {
    // Bearer {token}
    // Get header authorization
    const authorization = req.headers.authorization;

    //Cheack header authorization exist or has Bearer tag
    if (!authorization || !authorization.startsWith("Bearer")) {
      createError("unauthorized", 401);
    }

    // parse token
    const token = authorization.split(" ")[1];

    // check token got taged
    if (!token) {
      createError("unauthorized", 401);
    }

    const payload = tokenService.verify(token); // return payload {id: user.id} after verify success
    // const user = await User.findOne({ where: { id: payload.id } });
    const user = await userService.getUserById(payload.id); // get user from database with payload.id

    // if no user in database
    if (!user) {
      createError("unauthorized", 401);
    }

    // after all verify attrached user object to req
    req.user = user;

    // forword to normal route
    next();
  } catch (err) {
    next(err);
  }
};
