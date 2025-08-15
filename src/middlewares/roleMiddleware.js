
// const roleMiddleware = (...allowedRoles) => {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized: User not authenticated" });
//     }

//     if (!allowedRoles.includes(req.user.role)) {
//       return res.status(403).json({ message: "Forbidden: Access denied" });
//     }

//     next();
//   };
// };

// module.exports = roleMiddleware;


const adminOnlyMiddleware = (req, res, next) => {
    if (req.user.role === "admin"){
        next()
    }else{
        return res.status(401).json({message: "User is not admin"})
    }
  
}

const hotelOwnerOnlyMiddleware = (req, res, next) => {
    if (req.user.role === "hotel_owner"){
        next()
    }else{
        return res.status(401).json({message: "User is not a hotel owner"})
    }
}

const userOnlyMiddleware = (req, res, next) => {
    if (req.user){
        next()
    }else{
        return res.status(401).json({message: "User not logged in"})
    }
}

module.exports = {adminOnlyMiddleware, hotelOwnerOnlyMiddleware, userOnlyMiddleware}