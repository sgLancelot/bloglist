const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs.map(x => x.toJSON()))
})
  
blogRouter.post('', async (request, response) => {
    if (!request.body.likes) {
        request.body.likes = 0
    }
    const blog = new Blog(request.body)
  
    const result = await blog.save()
    response.status(201).json(result)
})

module.exports = blogRouter