const blogDetails =  require('../schemas/blogSchema')

//create CRUD
const postBlog = async (req, res) => {
    try {
        const user = req.user
        if(!user) return res.status(401).json({message: "Unauthorized"})
        const {title, content} = req.body
        const author = user.username
        const user_id =  user._id
        //validate
        if (!title|| !content) return res.status(400).json({message: "All fields are required!"})
        if (content.length < 10) return res.status(400).json({message: "content is too short"})

            //prevent duplicate product
            const wasFound = await blogDetails.findOne({content})
            if (wasFound) return res.status(400).json({message: "Blog already exist❎"})
       
                //proceed to save
                const blog =  new blogDetails({author, title, content, user_id})
                await blog.save()
                res.status(200).json({message: `Your blog was successfully posted ✅`})


    } catch (error) {
        res.status(500).json({
            message:  error.message
        })
    }
}


//edit blog post
const editBlog = async (req, res) => {
    try {
        const user =  req.user
        const {id} = req.params
        const author = user.username
        const {title, content} = req.body
            //validate
              if (!author) return res.status(401).json({message: "Unauthorized"})
            if (!title|| !content) return res.status(400).json({message: "All fields are required!"})
            if (content.length < 10) return res.status(400).json({message: "content is too short"})

                        //find blog first
                const blog = await blogDetails.findById(id)
                if (blog.length === 0) return res.status(404).json({ message: "Blog not found" })
                
                        //allow only author or admin
                    if (blog.user_id.toString() !== user._id.toString() && user.role !== "admin") {
                        return res.status(403).json({ message: "You are not allowed to edit this blog" })
                    }

                            //update
                            blog.title = title
                            blog.content = content

                            const updated = await blog.save()
                        if (!updated) return res.status(400).json({message: "Failed to edit blog.....Pls try again"})
                            res.status(200).json({updated, message:"Update successful ✅"})

        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}


//getBlogById
const getBlogById =  async (req, res) => {
    try {
        const user = req.user
        if (!user) return res.status(401).json({message: "Unauthorized"})
        const {id} = req.params
        const blog = await blogDetails.findById(id).select("-createdAt, -updatedAt")
            if (!blog) return res.status(400).json({message: "Blog does not exist"})
                res.status(200).json({blog, message: "Blog found ✅"})

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

//getAllBlogs

const getAllBlogs = async (req, res) => {
    try {
        const blog =  await blogDetails.find().select("-createdAt, -updatedAt")
            if (blog.length === 0) return res.status(400).json({message: "No Blog found"})
                 res.status(200).json({blog, message: "Blogs found ✅"})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

//deleteBlogById

const deleteBlogById = async (req, res) => {
    try {
        const user = req.user
        if (!user) return res.status(401).json({ message: "Unauthorized" })

        const user_id = user._id
        const { id } = req.params

        //find the blog first
        const blog = await blogDetails.findById(id)
        if (!blog) {
            return res.status(404).json({
                message: `Could not delete blog ....it does not exist`
            })
        }

        //check if user is owner or admin
        if (blog.user_id.toString() !== user_id.toString() && user.role !== "admin") {
            return res.status(403).json({
                message: "You are not allowed to delete this blog"
            })
        }

        //delete
        await blogDetails.findByIdAndDelete(id)

        res.status(200).json({
            message: `This Blog has been deleted ✅`
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const deleteAll = async (req,res) => {
    try {
        const deleteAll = await blogDetails.deleteMany({})
            if(deleteAll === 0) return res.status(400).json({message: "Couldn't make deletion"})
                res.status(200).json({message: "Success ✅"})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}







module.exports = {
   postBlog,
    editBlog,
    getBlogById,
    getAllBlogs,
    deleteBlogById,
    deleteAll
}
