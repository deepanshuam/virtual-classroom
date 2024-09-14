import jwt from "jsonwebtoken";
import User from "../Model/user.Model.js";

// Middleware to verify JWT token
export const verifyJWT = async (req, res, next) => {
  // Extract the token from either cookies or the Authorization header
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized request: No token provided" });
  }

  try {
    // Verify the token with the secret
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from the database using the ID from the decoded token
    const user = await User.findById(decodedToken.id).select("-password -refreshToken");

    if (!user) {
      return res.status(401).json({ message: "Invalid Access Token: User not found" });
    }

    // Attach the user information to the request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// Middleware to check if the user has admin role
export const isAdmin = (req, res, next) => {
  // Check if the user's role is admin
  if (req.user.role !== "admin") {
    return res.status(403).json({
      statusCode: 403,
      data: null,
      success: false,
      errors: [{ message: "Forbidden: User is not allowed" }],
    });
  }
  next();
};
