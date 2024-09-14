// import { Router } from 'express';
// import pkg from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import User from '../Model/user.Model.js'; // Ensure the correct path to your User model
// const { hash, compare } = pkg;
// const { sign } = jwt;

// const router = Router();

// // Register new user
// router.post('/register', async (req, res) => {
//     try {
//         const { name, email, password, role } = req.body;

//         // Validate input
//         if (!name || !email || !password) {
//             return res.status(400).json({ message: 'All fields are required' });
//         }

//         // Check if the email already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: 'User with this email already exists' });
//         }

//         // Hash password
//         const hashedPassword = await hash(password, 10);

//         // Create new user
//         const user = new User({ name, email, password: hashedPassword, role });
//         await user.save();

//         res.status(201).json({ message: 'User registered successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// // Login user
// router.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // Validate input
//         if (!email || !password) {
//             return res.status(400).json({ message: 'Email and password are required' });
//         }

//         // Find user by email
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ message: 'User not found' });
//         }

//         // Compare the entered password with the hashed password
//         const isMatch = await compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }
// console.log(isMatch);
//         // Generate JWT token
//         const token = sign(
//             { id: user._id, role: user.role },
//             process.env.JWT_SECRET,
//             { expiresIn: '1h' }  // Token expires in 1 hour
//         );

//         console.log(token);
//         res.json({ token });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// export default router;
import { Router } from "express";
import pkg from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Model/user.Model.js"; // Ensure the correct path to your User model
// import ApiResponse from "../utils/ApiResponse.js"; // Assuming you have a response handler
import { generateAccessAndRefereshTokens } from "../middleware/tokenUtility.js"; // Utility function for generating JWT tokens
// import ApiError from "../utils/ApiError.js"; // Correct import for ApiError
// import asyncHandler from "../utils/asyncHandler.js"; // Correct import for asyncHandler

const { hash } = pkg;

const router = Router();

// Register new user
router.post(
  "/register",
  async (req, res) => {
    const { name, email, password, role } = req.body;

    // Debugging request body
    console.log("Request Body:", req.body);

    // Validate input fields
    if (!name || !email || !password) {
      throw new error(400, "All fields are required");
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new error(409, "User with this email already exists");
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create new user in the database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // Default to 'user' role if not provided
    });

    // Remove sensitive fields from the response (like password)
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw error(
        500,
        "Something went wrong while registering the user"
      );
    }

    // Return response
    return res
      .status(201)
      .json((201, createdUser, "User registered successfully"));
  })
;

// Login user
router.post(
  "/login",
  async (req, res) => {
    const { email, password } = req.body;

    // Check if both email and password are provided
    if (!email || !password) {
      throw error(400, "Email and password are required");
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw error(404, "User does not exist");
    }

    // Validate password (assuming you have a method isPasswordCorrect on the User schema)
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw error
      (401, "Invalid credentials");
    }

    // Generate tokens (access and refresh)
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user._id
    );

    // Find the logged-in user details without password and refreshToken
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    // Set cookie options for security
    const cookieOptions = {
      httpOnly: true, // Ensures the cookie is accessible only by the web server
      secure: process.env.NODE_ENV === "production", // Cookie is secure in production
      sameSite: "Strict", // Protects against CSRF
    };

    // Send cookies and response
    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        (
          200,
          { user: loggedInUser, accessToken, refreshToken },
          "User logged in successfully"
        )
      );
  })
;

export default router;
