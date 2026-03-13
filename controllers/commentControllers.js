const Comment = require('../schemas/commentSchema')
const blogDetails = require('../schemas/blogSchema')

const createComment = async (req, res) => {
    try {
        const user = req.user
        if (!user) return res.status(401).json({ message: "Unauthorized" })

        const user_id = user._id
        const { comment } = req.body
        const { blogId } = req.params

        if (!comment) return res.status(400).json({ message: "Field is required!" })

        const blogExists = await blogDetails.findById(blogId)
        if (!blogExists) return res.status(404).json({ message: "Content not found" })

        const newComment = new Comment({
            user_id: user_id,
            blog: blogId,
            username: user.username,
            comment: comment.trim()
        })

        const saved = await newComment.save()

        const populatedComment = await Comment
            .findById(saved._id)
            .populate("user_id", "username")

        res.status(200).json({
            message: "Comment posted successfully",
            comment: populatedComment
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports = { createComment }