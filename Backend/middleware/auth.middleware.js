import jwt from "jsonwebtoken";
import User from "../Model/user.Model.js";
// import asyncHandler from "../utils/asyncHandler.js"; // Correct import for asyncHandler
// import ApiError from "../utils/ApiError.js"; // Correct import for ApiError

// Middleware to verify JWT token
export const verifyJWT = async (req, res, next) => {
  // Extract the token from either cookies or the Authorization header
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw error(401, "Unauthorized request: No token provided");
  }

  try {
    // Verify the token with the secret
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Fetch user from the database using the ID from the decoded token
    const user = await User.findById(decodedToken?.id).select(
      "-password -refreshToken" // Exclude sensitive information
    );

    if (!user) {
      throw new error(401, "Invalid Access Token: User not found");
    }

    // Attach the user information to the request object
    req.user = user;
    next();
  } catch (error) {
    throw new error(401, "Unauthorized: Invalid token");
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
