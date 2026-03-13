const express = require('express')


const authMiddleWare = require('../middlewares/authMiddleware')
const { createComment } = require('../controllers/commentControllers')


const commentRouter =  express.Router()

// create a user api
commentRouter
    .post('/blogs/:blogId/comment', authMiddleWare, createComment)
    







        module.exports = commentRouter
