import React, { useState } from "react"
import blogService from "../services/blogs"

const BlogForm = ({ blogs, setBlogs, setMessage }) => {
    const [newBlogTitle, setNewBlogTitle] = useState("")
    const [newBlogAuthor, setNewBlogAuthor] = useState("")
    const [newBlogURL, setNewBlogURL] = useState("")
    const [isVisible, setIsVisible] = useState(false)

    const handleNewBlog = async (event) => {
        event.preventDefault()
        try {
            const newBlog = await blogService.create({ title: newBlogTitle, author: newBlogAuthor, url: newBlogURL })
            handleHide()
            setMessage(`New blog: '${newBlog.title}', by ${newBlog.author}, at ${newBlog.url}`)
            setTimeout(() => {
                setMessage(null)
            }, 5000)
            setBlogs([...blogs, newBlog])
        } catch (error) {
            setMessage("Error submitting new blog!")
            setTimeout(() => {
                setMessage(null)
            }, 5000)
        }
    }

    const handleHide = () => {
        setNewBlogTitle("")
        setNewBlogAuthor("")
        setNewBlogURL("")
        setIsVisible(false)
    }

    if (!isVisible) {
        return (
            <button
                type="button"
                onClick={() => setIsVisible(true)}
                name="ShowBlogForm">
                Create a new blog
            </button>
        )
    } else {
        return (
            <div>
                <div>
                    <form onSubmit={handleNewBlog}>
                        <div>
                            <h2>Create a new entry</h2>
                            <div>
                                Title
                                <input type="text"
                                    value={newBlogTitle}
                                    name="NewBlogTitle"
                                    onChange={({ target }) => setNewBlogTitle(target.value)}/>
                            </div>
                            <div>
                                Author
                                <input type="text"
                                    value={newBlogAuthor}
                                    name="NewBlogAuthor"
                                    onChange={({ target }) => setNewBlogAuthor(target.value)}/>
                            </div>
                            <div>
                                URL
                                <input type="text"
                                    value={newBlogURL}
                                    name="NewBlogURL"
                                    onChange={({ target }) => setNewBlogURL(target.value)}/>
                            </div>
                            <button type="submit" id="createBlog">Create</button>
                        </div>
                    </form>
                </div>
                <button
                    type="button"
                    onClick={handleHide}>Cancel
                </button>
            </div>
        )
    }
}

export default BlogForm