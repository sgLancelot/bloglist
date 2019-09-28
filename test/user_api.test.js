const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
    await User.deleteMany()
})

describe('usersRouter API tests', () => {
    test('adding user successfully', async () => {
        await api
            .post('/api/users')
            .send(helper.testUser1)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/users')
        expect(response.body[0].name).toBe(helper.testUser1.name)
        expect(response.body[0].username).toBe(helper.testUser1.username)
    })

    test('1 character username', async () => {
        const testUser = {
            //username: 't',
            name: 'testname',
            password: 'testpassword'
        }
        await api
            .post('/api/users')
            .send(testUser)
            .expect(400)
    })

    test('1 character password', async () => {
        const testUser = {
            username: 'testuser',
            name: 'testname',
            //password: 't'
        }
        await api
            .post('/api/users')
            .send(testUser)
            .expect(400)
    })
})