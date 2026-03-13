const express = require('express')

const {postBlog, editBlog, getBlogById, getAllBlogs, deleteBlogById, deleteAll} = require("../controllers/blogController")
const authMiddleWare = require('../middlewares/authMiddleware')
const authorize = require('../middlewares/authorize')


const blogRouter =  express.Router()

// create a user api
blogRouter
    .post('/blog/post-blog', authMiddleWare, authorize("admin", "member"), postBlog)
    //to edit blog
     .put('/blog/edit-blog/:id',  authMiddleWare, authorize("admin", "member"), editBlog)
    //to get a blog
    .get('/blog/get-blog/:id',  authMiddleWare, authorize("admin", "member"), getBlogById)
    //get all blogs
    .get('/blog/getAllBlogs',  getAllBlogs)
     //delete blog
    .delete('/blog/delete-blog/:id', authMiddleWare, authorize("admin", "member"), deleteBlogById)
    //delete all
    .delete('/blog/delete-all-blog/', authMiddleWare, authorize("admin"), deleteAll)








        module.exports = blogRouter
