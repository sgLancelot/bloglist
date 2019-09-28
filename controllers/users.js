const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('', async (request,response, next) => {
    try {
        const body = request.body

        if (!body.password) {
            console.error('User validation failed: password is required')
            return response.status(400).send({error: 'password required'})
        } else if (body.password.length <= 3) {
            console.error('User validation failed: password is shorter than the minimum allowed length (3)')
            return response.status(400).send({error: 'password too short'})
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash,
        })

        const savedUser = await user.save()
        response.status(201).json(savedUser)

    } catch (exception) {
        next(exception)
    }
})

usersRouter.get('', async (request, response) => {
    const users = await User.find({})
    response.json(users.map(x => x.toJSON()))
})

module.exports = usersRouter