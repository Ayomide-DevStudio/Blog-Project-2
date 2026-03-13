const express = require('express')
const {signIn, signUp, clearAll, getAllUser} = require("../controllers/authController")
const authMiddleWare = require('../middlewares/authMiddleware')
const authorize = require('../middlewares/authorize')


const userRouter =  express.Router()

// create a user api
userRouter
    .post('/user/signup',  signUp)
    .post('/user/signin',  signIn)
    .delete('/user/clear-all', authMiddleWare, authorize("admin"), clearAll)
    .get('/user/view-all', authMiddleWare, authorize("admin"), getAllUser)







        module.exports = userRouter
