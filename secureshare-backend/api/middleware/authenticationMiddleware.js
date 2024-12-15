const envUtil = require("../util/envUtil");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("Auth token -> " + token);

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, envUtil.getJwtSecret(), (err, _) => {
    if (err) {
      console.log("Verification error");
      console.error(err);
      return res.sendStatus(403);
    }
    console.log("Token verified Successfully");
    next();
  });
};
