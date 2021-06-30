import React, {useState, useEffect} from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [newBlogTitle, setNewBlogTitle] = useState('')
    const [newBlogAuthor, setNewBlogAuthor] = useState('')
    const [newBlogURL, setNewBlogURL] = useState('')
    const [message, setMessage] = useState(null)

    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs(blogs)
        )
    }, [])

    useEffect(() => {
        const bloglistUser = window.localStorage.getItem('bloglistUser')
        if (bloglistUser) {
            const user = JSON.parse(bloglistUser)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const user = await loginService.login({username, password})
            window.localStorage.setItem(
                'bloglistUser', JSON.stringify(user)
            )
            blogService.setToken(user.token)
            setMessage(`Successfully logged in as ${user.name}`)
            setTimeout(() => {
                setMessage(null)
            }, 5000)
            setUser(user)
            setUsername('')
            setPassword('')
        } catch {
            setMessage('Wrong credentials!')
            setTimeout(() => {
                setMessage(null)
            }, 5000)
        }
    }

    const handleNewBlog = async (event) => {
        event.preventDefault()
        try {
            const newBlog = await blogService.create({title: newBlogTitle, author: newBlogAuthor, url: newBlogURL})
            setBlogs([...blogs, newBlog])
            setNewBlogTitle('')
            setNewBlogAuthor('')
            setNewBlogURL('')
            setMessage(`New blog: '${newBlog.title}', by ${newBlog.author}, at ${newBlog.url}`)
            setTimeout(() => {
                setMessage(null)
            }, 5000)
        } catch {
            setMessage('Error submitting new blog!')
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
                           onChange={({target}) => setUsername(target.value)}/>
                </div>
                <div>
                    Password
                    <input type="password"
                           value={password}
                           name="Password"
                           onChange={({target}) => setPassword(target.value)}/>
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    )

    const blogForm = () => (
        <div>
            <form onSubmit={handleNewBlog}>
                <div>
                    <h2>Create a new entry</h2>
                    <div>
                        Title
                        <input type="text"
                               value={newBlogTitle}
                               name="NewBlogTitle"
                               onChange={({target}) => setNewBlogTitle(target.value)}/>
                    </div>
                    <div>
                        Author
                        <input type="text"
                               value={newBlogAuthor}
                               name="NewBlogAuthor"
                               onChange={({target}) => setNewBlogAuthor(target.value)}/>
                    </div>
                    <div>
                        URL
                        <input type="text"
                               value={newBlogURL}
                               name="NewBlogURL"
                               onChange={({target}) => setNewBlogURL(target.value)}/>
                    </div>
                    <button type="submit">Create</button>
                </div>
            </form>
        </div>
    )

    const logOut = () => {
        window.localStorage.removeItem('bloglistUser')
        setUser(null)
        setMessage('Logged out')
        setTimeout(() => {
            setMessage(null)
        }, 5000)
    }

    const Message = () => {
        if (message !== null) {
            return <div style={{border: "2px solid"}}>{message}</div>
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
                {blogForm()}
                {blogs.map(blog =>
                    <Blog key={blog.id} blog={blog}/>
                )}
            </div>
        )
    }
}

export default App