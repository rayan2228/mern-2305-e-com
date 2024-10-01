export const validation = async (req, res, next) => {
    const { displayName, email, password } = req.body
    if (req.body.hasOwnProperty("displayName") && req.body.hasOwnProperty("email") && req.body.hasOwnProperty("password")) {
        if ([displayName, email, password].some((field) => field === "")) {
            return res.json("all fields are required")
        }
    } else {
        return res.json("invalid")
    }

    next()
}