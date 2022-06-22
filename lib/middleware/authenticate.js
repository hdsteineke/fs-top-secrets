const jwt = require('jsonwebtoken');

///this is to verify  cookies and grants user access to website/portal/what have you with a payload
module.exports = async (req, res, next) => {

  try {
    const cookie = req.cookies[process.env.COOKIE_NAME];

    //if there is no cookie, user sees error telling them to be signed in
    if (!cookie) throw new Error('You must be signed in to continue');

    //
    const user = jwt.verify(cookie, process.env.JWT_SECRET);
    req.user = user;

    next();

  } catch (error) {
    error.status = 401;
    next (error);
  }
};
