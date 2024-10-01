import { User } from "../models/userSchema.model.js"

import { mail } from "../utils/sendMail.js"
import { verificationTemplate } from "../mailTemp/verificationTemplate.js"



const generateTokens = async (id) => {
    try {
        const user = await User.findById({ _id: id })
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save()
        return { accessToken, refreshToken }
    } catch (error) {
        console.log(error);

    }
}



const createUser = async (req, res) => {
    try {
        const { displayName, email, password, phoneNumber } = req.body
        const isFound = await User.findOne({ email })
        if (isFound) {
            return res.json("email ache")
        }
        const user = await User.create({ displayName, email, password, phoneNumber })
        const link = await user.generateAccessToken()
        await mail(user.email, "verification", "hello", verificationTemplate(link))
        return res.json("ok")
    } catch (error) {
        console.log(error);
    }
}

const emailVerify = async (req, res) => {
    try {
        const { link } = req.params
        const user = new User()
        const result = await user.AccessTokenVerify(link)
        if (result) {
            const { email } = result
            const userFound = await User.findOne({ email })
            if (userFound) {
                if (userFound.emailVerified) {
                    return res.send("all ready verified")
                }
                userFound.emailVerified = Date.now()
                await userFound.save()
                return res.send("verified")
            } else {
                return res.send("invalid ")
            }
        } else {
            return res.send("invalid url")
        }
    } catch (error) {
        console.log("verify error", error);
    }

}


const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (req.body.hasOwnProperty("email") && req.body.hasOwnProperty("password")) {
            if ([email, password].some((field) => field === "")) {
                return res.send("all fields are required")
            }
        } else {
            return res.send("invalid")
        }

        const userFound = await User.findOne({ email })
        if (!userFound) {
            return res.send("email and password wrong 1")
        }
        const isPasswordCorrect = await userFound.checkPassword(password)
        console.log(isPasswordCorrect);

        if (!isPasswordCorrect) {
            return res.send("email and password wrong")
        }
        const { accessToken, refreshToken } = await generateTokens(userFound._id)
        return res.json({ accessToken, refreshToken })
    } catch (error) {
        console.log(error);
    }
}


const userUpdate = async (req,res) => {
    console.log(req.file);
    
}

export { createUser, emailVerify, login,userUpdate }