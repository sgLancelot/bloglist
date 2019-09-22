const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
    {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
    },
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
    },
    {
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
    },
    {
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
    },
    {
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
    }
]

beforeEach(async () => {
    await Blog.deleteMany()

    const blogObject = initialBlogs.map(x => new Blog(x))
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
    expect(response.body.length).toBe(initialBlogs.length)
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

    expect(response.body.length).toBe(initialBlogs.length + 1)
    expect(content).toContain('Second class tests')
})

test('check UID is ID instead of _ID', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body.map(x => x.id)).toBeDefined()
    expect(response.body.map(x => x._id)).not.toBe(undefined)
})

afterAll(() => {
    mongoose.connection.close()
})