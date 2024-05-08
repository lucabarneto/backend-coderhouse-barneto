const authorize = (req, res, next) => {
  if (!req.user)
    return req.policy.includes("public")
      ? next()
      : res.sendAuthenticationError(req.info);

  req.policy.includes(req.user.role)
    ? next()
    : res.sendAuthorizationError("User is unauthorized to enter this page");
};

module.exports = authorize;
