import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.Model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import { response } from "express";

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}


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
    console.log("Email:", email);

    if([
        fullName, email, userName, password
    ].some((field) => field?.trim() ==="")
    ){
        throw new ApiError(400,"All field required !!! line 30(user.controller.js)");
        
    }
    const existedUser = await User.findOne({ 
        $or:[{ userName }, { email }]
    })

    if(existedUser){ // If true then return this code 409 error
        throw new ApiError(409, "User with email or username already exists");
    }

    const avatarlocalPath = req.files?.avatar?.path
    console.log(avatarlocalPath,"This is local path checking ");
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if(!avatarlocalPath){
        throw new ApiError(400, "Avater Image is required !!")
    }
    // Gives proper path that is stored by multer

    const avatar = await uploadOnCloudinary(avatarlocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avater Image is required !!")
    }

    const user = await User.create({  // This is the method to access the database and create data object on the database.
        fullName,
        avatar: avater.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(), 
    })

    const createdUserName = await User.findOne(user._id).select(
        "-password -refreshToken -"
    )
    
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfullly !! Good Luck ")
    )
});

const loginUser = asyncHandler(async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie
    const {email, username, password} = req.body
    if (!username || !email) {
        throw new ApiError(400, "username or email is required")
    }
    const user = await User.findOne({
        $or: [{username}, {email}]
    })
    if (!user) {
        throw new ApiError(404, "User does not exist")
    }
   const isPasswordValid = await user.isPasswordCorrect(password)
   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }
   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
})
const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req,res) =>{
   const incomminRefefshToken = req.cookies.refreshToken || asyncHandler.body.refreshToken

   if (!incomminRefefshToken) {
        throw new ApiError(401,"Unauthorized request")
   }

   try {
    const decodedToken = jwt.verify(
     incomminRefefshToken,
     process.env.REFRESH_TOKEN_SECRET
     )
 
     const user = await User.findById(decodedToken?._id)
 
     if (!user) {
         throw new ApiError(401,"Invalid Refresh Token")
     }
 
     if (incomminRefefshToken !== user?.refreshToken) {
         throw new ApiError(401,"Refrsh Token in expired or used")
     }
 
     const options = {
         httpOnly: true,
         secure: true,
     }
 
     const{newaccessToken, newrefreshToken} =  await generateAccessAndRefereshTokens(user?._id)
 
     return res
     .status(200)
     .cookie("accessToken",newaccessToken, options)
     .cookie("refreshtoken",newrefreshToken, options)
     .json(
         new ApiResponse(
             200,
             {accessToken,refreshToken,newrefreshToken},
             "Access token refreshed"
         )
     )
   } catch (error) {
        throw new ApiError(401,error?.message || "Invalid refresh token")
   }
})


export { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
}; 
