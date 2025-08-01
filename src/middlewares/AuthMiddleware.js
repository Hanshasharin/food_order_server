const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel'); 

const secretKey = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token || token === 'null') {
    return res.status(401).send({ message: "Token missing or invalid" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);

    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; 
    next();
  } catch (err) {
    res.status(401).send({ message: "Unauthorized", error: err.message });
  }
};

module.exports = authMiddleware;
