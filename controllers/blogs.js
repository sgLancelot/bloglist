const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    console.log('AUTH IS', authorization)
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

blogRouter.get('', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username:1,name:1,id:1})
    response.json(blogs.map(x => x.toJSON()))
})
  
blogRouter.post('', async (request, response, next) => {
    const body = request.body

    if (!body.likes) {
        body.likes = 0
    } else if (!body.url && !body.title) {
        return response.status(400).send({error: 'Bad Request'})
    }

    const token = getTokenFrom(request)
    console.log('TOKEN IS', token)

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET)
        console.log('DECODED TOKEN', decodedToken)
        if (!token || !decodedToken.id) {
            return response.status(401).json({error: 'token missing or invalid'})
        }
        
        const user = await User.findById(decodedToken.id)

        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
            user: user._id
        })

        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.status(201).json(savedBlog.toJSON())
    } catch (exception) {
        next(exception)
    }
    
})

blogRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id, {useFindAndModify: false})
    response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, {new: true, useFindAndModify: false})
    response.json(updatedBlog.toJSON())
})

module.exports = blogRouter