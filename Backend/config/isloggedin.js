const jwt = require("jsonwebtoken");
const User = require("../model/User");

const isloggedIn =async (req, res, next) => {
 try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id).select("-password"); // password ko exclude kiya
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // ✅ request ke sath user attach
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = isloggedIn