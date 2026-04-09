import mongoose from "mongoose";
import bcrypt from "bcryptjs";
//to store data of user like name email password credits
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {   
        type: String,
        required: true,
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
    },
    password: {
        type: String,
        required: true,
    },
    credits: {
        type: Number,
        default: 20,
    },
    preferences: {
        emailNotifications: { type: Boolean, default: true },
        pushNotifications: { type: Boolean, default: true },
    },
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }   
    const salt = await bcrypt.genSalt(10); //generating salt
    this.password = await bcrypt.hash(this.password, salt); //hashing password with salt
    next();
} );
//we will not store the oriignal password fo user rather we will store hashed password for security i.e encrypted data


const User = mongoose.model("User", userSchema);


export default User;