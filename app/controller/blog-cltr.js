const Blog = require('../model/blog-model')
const { validationResult } = require('express-validator')
const { format } = require('date-fns')

const blogCltr = {}

blogCltr.list = (req, res) => {
    const { sortBy, sortOrder, page = 1, limit = 10 } = req.query

    
    // Define sort options
    let sort = {}
    if (sortBy && ['createdAt', 'updatedAt'].includes(sortBy)) {
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1
    }

    // Pagination options
    const options = {
        sort,
        skip: (parseInt(page) - 1) * parseInt(limit), // Convert page and limit to integers
        limit: parseInt(limit)
    }

    Blog.find({}, null, options)
        .then((blogs) => {
            // Convert blog dates to IST format before sending response
            const blogsWithIST = blogs.map(blog => convertToIST(blog))
            res.json(blogsWithIST)
        })
        .catch((err) => {
            res.status(500).json({ error: err.message })
        })
}

blogCltr.create = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const body = req.body
    const blog = new Blog(body)
    blog.save()
        .then((savedBlog) => {
            res.status(201).json(convertToIST(savedBlog))
        })
        .catch((err) => {
            res.status(500).json({ error: err.message })
        })
}

blogCltr.show = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { id } = req.params
    Blog.findById(id)
        .then((blog) => {
            if (!blog) {
                return res.status(404).json({ error: 'Blog not found' })
            }
            res.json(convertToIST(blog))
        })
        .catch((err) => {
            res.status(500).json({ error: err.message })
        })
}

blogCltr.remove = (req, res) => {
    const { id } = req.params
    Blog.findByIdAndDelete(id)
        .then((deletedBlog) => {
            if (!deletedBlog) {
                return res.status(404).json({ error: 'Blog not found' })
            }
            res.json(convertToIST(deletedBlog))
        })
        .catch((err) => {
            res.status(500).json({ error: err.message })
        })
}

blogCltr.update = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { id } = req.params
    const body = req.body;
    Blog.findByIdAndUpdate(id, { ...body }, { new: true })
        .then((updatedBlog) => {
            if (!updatedBlog) {
                return res.status(404).json({ error: 'Blog not found' })
            }
            res.json(convertToIST(updatedBlog))
        })
        .catch((err) => {
            res.status(500).json({ error: err.message })
        })
}

// function convertToIST(blog) {
//     const istDateFormat = 'yyyy-MM-dd HH:mm:ss' // Desired IST format string
//     return {
//         ...blog.toObject(),
//         createdAt: format(blog.createdAt, istDateFormat),
//         updatedAt: format(blog.updatedAt, istDateFormat),
//     }
// }

function convertToIST(blog) {
    const istDateFormat = 'yyyy-MM-dd HH:mm:ss' // Desired IST format string
    return {
        ...blog.toObject(),
        createdAt: blog.createdAt ? format(new Date(blog.createdAt), istDateFormat) : 'Invalid Date',
        updatedAt: blog.updatedAt ? format(new Date(blog.updatedAt), istDateFormat) : 'Invalid Date',
    }
}

module.exports = blogCltr
