
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const configureDB = require('./config/db')
const {checkSchema} = require('express-validator')
const { blogValidationSchema , idValidationSchema,validate} = require('./app/validator/blog-validator')
const blogCltr = require('./app/controller/blog-cltr')
const app = express()
app.use(express.json())
app.use(cors())  
const port = 5000
configureDB()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Create Blog
app.post('/api/blogs', validate(checkSchema(blogValidationSchema)), blogCltr.create)
// Get Blogs with Sorting and Pagination
app.get('/api/blogs', blogCltr.list)
// Get Blog by ID
app.get('/api/blogs/:id', validate(checkSchema(idValidationSchema)), blogCltr.show)
// Update Blog
app.put('/api/blogs/:id', validate([checkSchema(idValidationSchema), checkSchema(blogValidationSchema)]), blogCltr.update)
// Delete Blog
app.delete('/api/blogs/:id', validate(checkSchema(idValidationSchema)), blogCltr.remove)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })