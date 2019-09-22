/* Write a test that verifies that making an HTTP POST request to 
the /api/blogs url successfully creates a new blog post. At the 
very least, verify that the total number of blogs in the system 
is increased by one. You can also verify that the content of the 
blog post is saved correctly to the database.

Once the test is finished, refactor the operation to use async/await 
instead of promises.
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