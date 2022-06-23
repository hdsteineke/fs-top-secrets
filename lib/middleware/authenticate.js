const jwt = require('jsonwebtoken');

///this file is to verify  cookies and grants user access to website/portal/what have you with a payload
module.exports = async (req, res, next) => {

  try {
    //assigns cookie upon sign-in
    const cookie = req.cookies[process.env.COOKIE_NAME];

    //if there is no cookie, user sees error telling them to be signed in
    if (!cookie) throw new Error('You must be signed in to continue');

    // verifies cookie and secret access key on the user making the request to sign in
    const user = jwt.verify(cookie, process.env.JWT_SECRET);
    req.user = user;

    next();

  } catch (error) {
    error.status = 401;
    next (error);
  }
};
