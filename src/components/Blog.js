import React, {useState} from 'react'
import blogService from "../services/blogs";

const Blog = ({blog, blogs, setBlogs, user, setMessage,}) => {
    const [showDetail, setShowDetail] = useState(false)
    const [likes, setLikes] = useState(blog.likes)
    const blogStyle = {border: "2px solid", margin: "5px", padding: "5px"}

    const handleDelete = async (event) => {
        event.preventDefault()
        if (window.confirm(`Delete ${blog.title}?`)) {
            try {
                await blogService.deleteBlog(blog)
                setMessage(`${blog.title} successfully deleted`)
                setTimeout(() => {
                    setMessage(null)
                }, 5000)
                setBlogs(blogs.filter(b => b.id !== blog.id))
            } catch {
                setMessage(`Could not delete ${blog.title}`)
                setTimeout(() => {
                    setMessage(null)
                }, 5000)
            }
        }
    }

    const handleLike = async (event) => {
        event.preventDefault()
        try {
            const updatedBlog = await blogService.addLike({...blog, likes})
            setMessage(`You liked blog ${blog.title}`)
            setTimeout(() => {
                setMessage(null)
            }, 5000)
            setLikes(updatedBlog.likes)
        } catch {
            setMessage(`Couldn't like blog ${blog.title}`)
            setTimeout(() => {
                setMessage(null)
            }, 5000)
        }
    }

    if (showDetail) {
        return <div style={blogStyle}>
            <h3>{blog.title}
                <button type="button"
                        onClick={() => setShowDetail(false)}>
                    Hide
                </button>
            </h3>

            <p>URL: {blog.url}</p>
            <p>Likes: {likes}
                <button type="button"
                        onClick={handleLike}>
                    Like
                </button>
            </p>
            <p>Author: {blog.author}</p>
            {blog.user && blog.user.name === user.name ?
                <button type="button"
                        onClick={handleDelete}>
                    Delete</button> :
                null
            }
        </div>
    } else {
        return (<div style={blogStyle}>
            {blog.title} {blog.author}
            <button type="button"
                    onClick={() => setShowDetail(true)}>
                View
            </button>
        </div>)
    }
}

export default Blog