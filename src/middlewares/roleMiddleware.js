// const adminOnlyMiddleware = (req, res, next) => {
//   if (!req.user) {
//     return res.status(401).json({ message: "Unauthorized: User not authenticated" });
//   }

//   if (req.user.role !== "admin") {
//     return res.status(403).json({ message: "Forbidden: Admins only" });
//   }

//   next(); // user is admin, proceed
// };

// module.exports = adminOnlyMiddleware;


// roleMiddleware.js
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    next();
  };
};

module.exports = roleMiddleware;
