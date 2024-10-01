import express from "express"
import cors from "cors"
const app = express();

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("./public"))
app.use(cors({
    origin: "*",
    credential: true
}))

// all routes
import userRouter from "./routes/userRoute.route.js"
app.use("/api/v1/", userRouter)

export default app