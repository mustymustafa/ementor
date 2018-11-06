var middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
  const token_secret = "i05love10myparents1998";
  // check for token in the header first, then if not provided, it checks whether it's supplied in the body of the request
  var token = req.headers["x-access-token"] || req.body.token;
  if (token) {
    jwt.verify(token, token_secret, function(err, decoded) {
      if (!err) {
        req.decoded = decoded; // this add the decoded payload to the client req (request) object and make it available in the routes
        next();
      } else {
        res.status(403).send("Invalid token supplied");
      }
    });
  } else {
    res.status(403).send("Authorization failed! Please provide a valid token");
  }
};

module.exports = middlewareObj;
