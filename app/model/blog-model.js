const mongoose = require('mongoose')
const { Schema, model } = mongoose
const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    content: {
        type: String,
        required: true,
        minlength: 10
    }}, {timestamps: true })

const Blog = model('Blog', blogSchema)

module.exports = Blog
