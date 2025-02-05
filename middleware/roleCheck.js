const roleCheck = (allowedRoles) => {
    return (req, res, next) => {
      const userRole = req.user.role;  // Access the role from the JWT
  
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: "Forbidden: Access Denied" });
      }
  
      next();  // Allow the request to proceed if the role matches
    };
  };
  
  module.exports = roleCheck;
  