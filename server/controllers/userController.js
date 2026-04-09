// import User from "../models/User.js";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";

// //Generate jwt
// const generateToken = (id) => {
//     // Logic to generate JWT will go here
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: "30d",
//     });
// }


// //API TO REGISTER USER
// export const registerUser = async(req, res) => {
//     const { name, email, password } = req.body;
//     // Logic to register user will go here
//     try{
//         // Check if user already exists
//         const userExists=await User.findOne({ email });
//         if(userExists){
//             return res.status(400).json({ message: 'User already exists' });
//         }
//         const user=await User.create({
//             name,
//             email,
//             password,
//         });
//         const token=generateToken(user._id);
//         res.json({ success:true, token });
        
//     }
//     catch(error){   
//         return res.status(500).json({ message: error.message });
//     }
    
// };
// //API TO LOGIN USER
// export const loginUser = async(req, res) => {
//     const { email, password } = req.body;   
//     // Logic to login user will go here
//     try{
//         const user=await User.findOne({ email });
//         if(user){
//             const isMatch=await bcrypt.compare(password, user.password);
//             if(isMatch){
//                 const token=generateToken(user._id);
//                 return res.json({ success:true, token });
//             }
//         }
//         return res.status(400).json({ message: 'Invalid credentials' });
//     }
//     catch(error){
//         return res.status(500).json({ message: error.message });
//     }   
// };

// //API TO GET USER DETAILS
// export const getUser = async (req, res) => {
//     // Return the authenticated user details (assumes `protect` middleware set req.user)
//     try {
//         const user = req.user;
//         return res.json({ success: true, user });
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// };
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Chat from "../models/Chat.js";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// REGISTER USER
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Please enter a valid email address" });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// LOGIN USER
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Compare password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
        console.error("CRITICAL ERROR: JWT_SECRET is not defined in environment variables");
        return res.status(500).json({ success: false, message: "Server configuration error" });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET LOGGED-IN USER DETAILS
export const getUser = async (req, res) => {
  try {
    // protect middleware sets req.user
    const user = req.user;

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// api to get published image
export const getPublishedImages=async(req,res)=>{
  try{
    const publishedImageMessages= await Chat.aggregate([
      {$unwind:"$messages"},
      {
        $match: {
          "messages.isImage":true,
          "messages.isPublished":true
        }

      },
      {
        $project:{
          _id:0,
          imageUrl:"$messages.content",
          userName: "$userName"
        }
      }
    ])
    res.json({success:true,images:publishedImageMessages.reverse()})
  }
  catch(error){
    return res.json({success:false,message:error.message});

  }
}

// CHANGE PASSWORD
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect current password" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DEACTIVATE ACCOUNT
export const deactivateAccount = async (req, res) => {
  try {
    await Chat.deleteMany({ userId: req.user._id });
    await User.findByIdAndDelete(req.user._id);
    res.json({ success: true, message: "Account deactivated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE USER PREFERENCES
export const updatePreferences = async (req, res) => {
  try {
    const { preferences } = req.body;
    const user = await User.findById(req.user._id);

    user.preferences = { ...user.preferences, ...preferences };
    await user.save();

    res.json({ success: true, message: "Preferences updated successfully", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
