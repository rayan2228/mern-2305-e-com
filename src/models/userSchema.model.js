import { mongoose, Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
const userSchema = new Schema({
    displayName: {
        type: String,
        required: [true, "name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlength: [8, "minimum length is 8"],
    },
    phoneNumber: {
        type: String,
    },
    emailVerified: {
        type: Date,
    },
    resetPasswordToken: {
        type: String,
    },
    profilePic: {
        type: String
    },
    role: {
        type: String,
        enum: ["user", "seller", "admin", "editor"],
        lowercase: true,
        default: "user"
    },
    address: [
        { street: String }, { postalCode: String }, { district: String }, { country: String }
    ],
    refreshToken: {
        type: String,
    }
}, {
    timestamps: true
})




userSchema.pre("save", async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

userSchema.methods.checkPassword = async function (mypassword) {
    return await bcrypt.compare(mypassword, this.password);
}

userSchema.methods.generateAccessToken = async function () {
    return jwt.sign({
        id: this._id,
        email: this.email
    }, process.env.ACCESS_TOKEN_SC, { expiresIn: process.env.ACCESS_TOKEN_EX });
}

userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign({
        id: this._id,
        email: this.email
    }, process.env.REFRESH_TOKEN_SC, { expiresIn: process.env.REFRESH_TOKEN_EX });
}

userSchema.methods.AccessTokenVerify = function (token) {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SC, function (err, decoded) {
        if (err) {
            return null
        }
        return decoded
    });

}


export const User = mongoose.model("User", userSchema)