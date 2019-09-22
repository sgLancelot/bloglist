const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs.map(x => x.toJSON()))
})
  
blogRouter.post('', async (request, response) => {
    if (!request.body.likes) {
        request.body.likes = 0
    } else if (!request.body.url && !request.body.title) {
        return response.status(400).send({error: 'Bad Request'})
    }
    const blog = new Blog(request.body)
  
    const result = await blog.save()
    response.status(201).json(result)
})

blogRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, {new: true, useFindAndModify: false})
    response.json(updatedBlog.toJSON())
})

module.exports = blogRouter