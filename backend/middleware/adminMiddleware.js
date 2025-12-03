// This middleware should be used AFTER the main authMiddleware

module.exports = function (req, res, next) {
  // The authMiddleware should have already decoded the JWT 
  // and placed its payload onto req.user.
  // We check for the isAdmin flag within that payload.
  
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ msg: 'Access denied. Admins only.' });
  }
  
  next();
};