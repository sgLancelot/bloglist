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