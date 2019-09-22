/* Write a test that verifies that the unique identifier property of 
the blog posts is named id, by default the database names the property 
_id. Verifying the existence of a property is easily done with Jest's 
toBeDefined matcher:

Make the required changes to the code so that it passes the test. The 
toJSON method discussed in part 3 is an appropriate place for defining 
the id parameter.
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