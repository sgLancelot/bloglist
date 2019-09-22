const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany()

    const blogObject = helper.initialBlogs.map(x => new Blog(x))
    const promiseArray = blogObject.map(x => x.save())
    await Promise.all(promiseArray)
})

test('blogs returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
})

test('there are 6 notes', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body.length).toBe(helper.initialBlogs.length)
})

test('a valid blog can be added', async () => {
    const newBlog = {
      title: "Second class tests",
      author: "Robert D. Martin",
      url: "www.google.com",
      likes: 8,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const content = response.body.map(x => x.title)

    expect(response.body.length).toBe(helper.initialBlogs.length + 1)
    expect(content).toContain('Second class tests')
})

test('check UID is ID instead of _ID', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body.map(x => x.id)).toBeDefined()
    expect(response.body.map(x => x._id)).not.toBe(undefined)
})

test('if likes property is missing from request, likes = 0', async () => {
    const newBlog = {
      title: "Second class tests",
      author: "Robert D. Martin",
      url: "www.google.com",
      //likes: 8,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const newPostedBlog = await response.body.find(x => x.title === 'Second class tests')
    expect(newPostedBlog.likes).toBe(0)
})

test('if title and url missing, responsds with status 400.', async () => {
    const newBlog = {
      //title: "Second class tests",
      author: "Robert D. Martin",
      //url: "www.google.com",
      likes: 8,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
})

test('test deleting a blog', async () => {
    const newBlog = {
      title: "Second class tests",
      author: "Robert D. Martin",
      url: "www.google.com",
      likes: 8,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)

    const response = await api.get('/api/blogs')
    const newPostedBlog = await response.body.find(x => x.title === 'Second class tests')
    await api
      .delete(`/api/blogs/${newPostedBlog.id}`)
      .expect(204)
})

test('test functionality for updating info of individual blog post', async () => {
    const updatedBlog = {likes: 78}

    const response = await api.get('/api/blogs')
    const newPostedBlog = await response.body.find(x => x.title === 'React patterns')
    await api
      .put(`/api/blogs/${newPostedBlog.id}`)
      .send(updatedBlog)

    const updatedResponse = await api.get('/api/blogs')
    const updatedPostedBlog = await updatedResponse.body.find(x => x.title === 'React patterns')
    expect(updatedPostedBlog.likes).toBe(78)
})

afterAll(() => {
    mongoose.connection.close()
})