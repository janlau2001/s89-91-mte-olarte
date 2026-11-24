const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET || "BlogAPI";

module.exports.createAccessToken = (user) => {
  const data = {
    id: user._id,
    email: user.email,
    username: user.username,
    isAdmin: user.isAdmin,
  };

  return jwt.sign(data, secret, {});
};

module.exports.verify = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ auth: "Failed. No Token" });
  }

  const token = authHeader.slice(7);

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      return res.status(401).send({ auth: "Failed", message: err.message });
    }

    req.user = decodedToken;
    next();
  });
};

module.exports.verifyAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }

  return res.status(403).send({ auth: "Failed", message: "Action Forbidden" });
};
