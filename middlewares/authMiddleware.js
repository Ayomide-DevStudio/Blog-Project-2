const userDetails =  require ("../schemas/userSchema")
const jwt =  require("jsonwebtoken")


const authMiddleWare = async (req, res, next) => {
    const token = req.cookies.token
    const passKey = process.env.SECRET_KEY
        if(!token) return res.status(401).json({message: "Unauthorized"})
                try {
                    const verifiedToken = jwt.verify(token, passKey)
                            const user =  await userDetails.findById(verifiedToken.id).select("-password")
                                if (!user) return res.status(401).json({message: "Unauthorized"})
                                    req.user = user
                                        next()

                } catch (error) {
                      //console.error(error)
                    res.status(401).json({
                        message: "Invalid or expired session"
                    })
                }

    }
module.exports = authMiddleWare