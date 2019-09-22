const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('', async (request, response) => {
    const blogs = await Blog.find({})
    console.log('IT WENT THROUGH HERE!')
    response.json(blogs.map(x => x.toJSON()))
})
  
blogRouter.post('', (request, response) => {
    const blog = new Blog(request.body)
  
    blog
      .save()
      .then(result => {
        response.status(201).json(result)
    })
})

module.exports = blogRouter