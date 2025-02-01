import { asyncHandler } from "../utils/asyncHandler.js";
import {Apierror} from '../utils/Apierror.js'

    // Get user details from frontened
    // Validation - Not empty
    // Check if user already exists: username, email
    // Check for images, Check for avatar
    // Upload them to cloudnary, Avatar
    // Create user object - Create entry in DB
    // Remove password and refresh token field from response 
    // Check for user creation 
    // Return response

const registerUser = asyncHandler(async (req, res) => {
   
    console.log("Incoming Request Body: ", req.body);

    if (!req.body) {
        return res.status(400).json({ error: "Request body is missing" });
    }

    const { userName, email, fullName, password } = req.body;

    if (!userName || !email || !fullName || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    console.log("Email:", email);
    res.status(201).json({ message: "User registered successfully" });

    
});

export { registerUser };
