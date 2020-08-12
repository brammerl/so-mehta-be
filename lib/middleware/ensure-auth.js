const User = require('../models/User');

module.exports = (req, res, next) => {
  try {
    const token = req.cookies.session;
    const user = User.tokenToUser(token);
    req.user = user;
    next();
  } catch(err) {
    next(err);
  }
};