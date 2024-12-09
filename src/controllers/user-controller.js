import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user-model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js"; 

// this method used in login 
const generateAccessAndRefreshToken = async (userId) => {
	try {
		const user = await User.findById(userId)
		const accessToken = user.generateAccessToken()
		const refreshToken = user.generateRefreshToken()

		user.refreshToken = refreshToken
		await user.save({ validateBeforeSave: false })

		return {accessToken, refreshToken}

	} catch (error) {
		throw new ApiError(500, "Something went wrong while generating refreah and access token")
	}
}  


const userRegister = asyncHandler( async (req, res) => {

	/* get user details from frontend
	 validation - not empty
	 check if user already exists: username, email
	 check for images, check for avatar
	 upload them to cloudinary, avatar
	 create user object - create entry in db
	 remove password and refresh token field from response
	 check for user creation
	 return res */

	const { fullName, email, username, password } = req.body;
	// console.log(fullName)

	/*  some method returns true if At least one element in the array satisfies the condition.
	  mean k agr koi b field empty hui to ya true return kra ga. */
	if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
		throw new ApiError(400, "All fiels are required!")
	}

	/* The $or operator allows you to perform a logical OR operation.
	 It takes an array of conditions, and if any one of the conditions is true,
	 the query will match the document.
	 mean k agr dono ma se ik b match ho gya to user return kr de ga. */
	const existedUser = await User.findOne({ $or: [{ username }, { email }] })
	if (existedUser) {
		throw new ApiError(409, "User with email or username already exists")
	}

	// console.log(req.files)

	const avatarLocalPath = req.files?.avatar[0]?.path;
	// const coverImageLocalPath = req.files?.coverImage[0]?.path; // agr user ne coverimage na di to is code se error a skta hai. [avatarLocalPath] ka validation bad ma check kr rha hain.

	let coverImageLocalPath;
	if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
		coverImageLocalPath = req.files.coverImage[0].path
	}
	
	if(!avatarLocalPath) {
		throw new ApiError(400, "Avatar file is requierd!")
	}

	const avatar = await uploadOnCloudinary(avatarLocalPath)
	const coverImage = await uploadOnCloudinary(coverImageLocalPath)
	// console.log(avatar)

	if(!avatar) {
		throw new ApiError(400, "Avatar file is requierd!")
	}

	const user = await User.create({
		fullName,
		avatar: avatar.url,
		coverImage: coverImage?.url || "",
		email,
		password,
		username: username.toLowerCase()
	})

	const createdUser = await User.findById( user._id ).select("-password -refreshToken");

	if(!createdUser) {
		throw new ApiError(500, "Something went wrong while registering the user")
	}

	return res.status(201).json(
		new ApiResponse(200, createdUser, "User registered Successfully")
	)
	
})

const userLogin = asyncHandler( async (req, res) => {
  /* req body -> data
     username or email
     find the user
     password check
     access and referesh token
     send cookie */

	const {username, email, password} = req.body;

	if(!username || !email){
		throw new ApiError(400, "username or email is required!")
	}

	const user = await User.findOne({ $or: [{username}, {email}] })

	if(!user){
		throw new ApiError(404, "User does not exist");
	}

	const isPasswordValid = await user.isPasswordCorrect(password);

	if(!isPasswordValid){
		throw new ApiError(401, "Invalid User Credentials");
	}

	const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);
 

})

export { userRegister, userLogin }