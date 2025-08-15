const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel'); 
const secretKey = process.env.JWT_SECRET;

// const authMiddleware = async (req, res, next) => {
//   const token = req.cookies.token;

//   if (!token || token === 'null') {
//     return res.status(401).send({ message: "Token missing or invalid" });
//   }

//   try {
//     const decoded = jwt.verify(token, secretKey);

//     const user = await userModel.findOne({ email: decoded.email });

//     if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     req.user = user; 
//     next();
//   } catch (err) {
//     res.status(401).send({ message: "Unauthorized", error: err.message });
//   }
// };




const authMiddleware = async (req, res, next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1]
        var decoded = jwt.verify(token, secretKey);
        console.log(decoded)
        const user = await UserModel.findOne({email: decoded.email})
        req.user = user
    }catch(err){
        console.log("Not authorized")
    }
    next()
}




module.exports = authMiddleware;
