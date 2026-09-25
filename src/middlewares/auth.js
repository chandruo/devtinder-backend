const User = require("../models/user");
const jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const tokenverified = jwt.verify(token, "JWT_SECRET");

    const user = await User.findById({ _id: tokenverified.userId });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  auth,
};
