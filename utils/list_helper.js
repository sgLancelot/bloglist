/* Use the supertest package for writing a test that makes an HTTP GET
 request to the /api/blogs url. Verify that the blog list application 
 returns the correct amount of blog posts in the JSON format.
 
 Once the test is finished, refactor the route handler to use the 
 async/await syntax instead of promises.

 Notice that you will have to make similar changes to the code that 
 were made in the material, like defining the test environment so 
 that you can write tests that use their own separate database.
 */

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => {
        return sum + blog.likes
    }, 0)
}

const favouriteBlog = (blogs) => {
    const likesArray = blogs.map(blog => blog.likes)
    if (likesArray.length === 0) {
        return []
    }
    const maxLikes = Math.max(...likesArray)
    return blogs.find(blog => blog.likes === maxLikes)
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog
}