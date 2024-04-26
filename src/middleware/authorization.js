const authorize = (req, res, next) => {
  console.log(req.user);

  req.policy.includes(req.user.role)
    ? next()
    : res.sendAuthorizationError("User is unauthorized to enter this page");
};

module.exports = authorize;
