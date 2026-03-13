require('dotenv').config()
const express = require('express')
const connectDB =  require('./mongodb/dbconnection')
const blogRouter = require('./routers/blogRouter')
const userRouter = require('./routers/userRouter')
const commentRouter = require('./routers/commentRouter')
const cookieParser = require('cookie-parser')

connectDB()

const server = express()
const port = process.env.PORT || 2000

//middleware
server.use(express.json())
server.use(express.urlencoded({extended: true}))
server.use(cookieParser())



//router
 server.use('/api', blogRouter)
  server.use('/api', userRouter)
  server.use('/api', commentRouter)


// server.listen(port, () => {
//     console.log(`Server is listening on port ${port}`)
// })
