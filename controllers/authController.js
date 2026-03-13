const userDetails =  require ("../schemas/userSchema")
const bcrypt = require('bcrypt')
const jwt =  require("jsonwebtoken")




const signIn = async (req, res) => {

    try {
        
        const {email, password} =  req.body
            if (!email || !password) {
                res.status(400).json({message: "Please provide all fields"})
                return 
            } else{
                const user =  await userDetails.findOne({email})
                if (!user) return res.status(400).json({message: "User does not exist ❎"})
                    const pass = await bcrypt.compare(password.trim(), user.password)
                        if (!pass) return res.status(400).json({message: "email or password is incorrect"})
                             
                                const secret_key =  process.env.SECRET_KEY


                                const getToken = (id) => {
                                    return jwt.sign({id}, secret_key, {expiresIn: "60m"})
                                    
                                }
                            const token = getToken(user._id)
                             return res
                                        .cookie('token', token, {httpOnly: true, sameSite: 'strict'})
                                        .status(200)
                                        .json({message: "you have signed in successfully ✅"})
            }
            
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }


}

const signUp = async (req, res) => {
 try {
    const {username, email, password, role} = req.body

    if (!username || !email || !password || !role){
        return res.status(400).json({
            message:  "All fields are required!"
        })
    }
    if (username.length < 3){
        return res.status(400).json({
            message: "username is too short"
        })
    }
    if (password.length < 6){
        return res.status(400).json({
            message: "Password should be at least 6 characters"
        })
    }
  

    const emailExist =  await userDetails.findOne({email})
    if (emailExist) return res.status(400).json({message: "pls try again , Email exists already"})
        
        //HASH PASSWORD
        const hashPass = await bcrypt.hash(password, 15)
        

        
                                const secret_key =  process.env.SECRET_KEY


                                const getToken = (id) => {
                                    return jwt.sign({id}, secret_key, {expiresIn: "30m"})
                                    
                                }

                            const user = new userDetails ({username, email, password: hashPass, role})
                            await user.save()
                            const token = getToken(user._id)
                         
                            return res
                                        .cookie('token', token, {httpOnly: true, sameSite: 'strict'})
                                        .status(200)
                                        .json({message: "Account created successfully✅"})
                                      

 } catch (error) {
    console.error(error)
    res.status(500).json(({
        message: error.message
    }))
 }
}
const clearAll = async (req, res) => {
    try {
        const clear =  await userDetails.deleteMany({role: {$ne: "admin"}})
        if (!clear) return res.status(400).json({message: "Clear Impossible"})
            res.status(200).json({message: "Cleared"})

    } catch (error) {
        res.status(500).json(({
            message: error.message
        }))
    }
}
const getAllUser = async (req, res) => {
    try {
        const user =  await userDetails.find().select("-createdAt, -updatedAt, -password")
            if (user === 0) return res.status(400).json({message: "No Blog found😒"})
                 res.status(200).json({user, message: "users found ✅"})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports = {signIn, signUp, clearAll, getAllUser}


