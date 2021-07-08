import React, { useState, useEffect } from "react"
import Blog from "./components/Blog"
import blogService from "./services/blogs"
import loginService from "./services/login"
import BlogForm from "./components/BlogForm"

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [user, setUser] = useState(null)
    const [message, setMessage] = useState(null)

    useEffect(() => {
        const bloglistUser = window.localStorage.getItem("bloglistUser")
        if (bloglistUser) {
            const user = JSON.parse(bloglistUser)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs(blogs.sort((b1, b2) => b2.likes - b1.likes))
        )
    }, [])

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const user = await loginService.login({ username, password })
            window.localStorage.setItem(
                "bloglistUser", JSON.stringify(user)
            )
            blogService.setToken(user.token)
            setMessage(`Successfully logged in as ${user.name}`)
            setTimeout(() => {
                setMessage(null)
            }, 5000)
            setUser(user)
            setUsername("")
            setPassword("")
        } catch (error) {
            setMessage("Wrong credentials!")
            setTimeout(() => {
                setMessage(null)
            }, 5000)
        }
    }

    const loginForm = () => (
        <div>
            <h2>Log in</h2>
            <Message/>
            <form onSubmit={handleLogin}>
                <div>
                    Username
                    <input type="text"
                        value={username}
                        name="Username"
                        onChange={({ target }) => setUsername(target.value)}/>
                </div>
                <div>
                    Password
                    <input type="password"
                        value={password}
                        name="Password"
                        onChange={({ target }) => setPassword(target.value)}/>
                </div>
                <button type="submit" id="loginButton">Login</button>
            </form>
        </div>
    )

    const logOut = () => {
        window.localStorage.removeItem("bloglistUser")
        setUser(null)
        setMessage("Logged out")
        setTimeout(() => {
            setMessage(null)
        }, 5000)
    }

    const Message = () => {
        if (message !== null) {
            return <div style={{ border: "2px solid" }} id="message">{message}</div>
        }
        return null
    }


    if (user === null) {
        return loginForm()
    } else {
        return (
            <div>
                <Message/>
                <h2>blogs</h2>
                <div>
                    <p>{user.name} logged in</p>
                    <button type="button" onClick={logOut}>Log out</button>
                </div>
                <BlogForm
                    blogs={blogs}
                    setBlogs={setBlogs}
                    setMessage={setMessage}
                />
                {blogs.map(blog =>
                    <Blog
                        key={blog.id}
                        blog={blog}
                        blogs={blogs}
                        setBlogs={setBlogs}
                        user={user}
                        setMessage={setMessage}
                    />
                )}
            </div>
        )
    }
}

export default App