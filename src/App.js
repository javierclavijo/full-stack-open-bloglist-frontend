import React, {useState, useEffect} from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

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
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({username, password})
      window.localStorage.setItem(
          'bloglistUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      console.log('Wrong credentials!')
    }
  }

  const loginForm = () => (
      <div>
        <h2>Log in</h2>
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
            <input type="text"
                   value={password}
                   name="Password"
                   onChange={({target}) => setPassword(target.value)}/>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
  )

  const logOut = () => {
    window.localStorage.removeItem('bloglistUser')
    setUser(null)
  }

  if (user === null) {
    return loginForm()
  } else {
    return (
        <div>
          <h2>blogs</h2>
          <p>{user.name} logged in</p>
          <button type="button" onClick={logOut}>Log out</button>
          {blogs.map(blog =>
              <Blog key={blog.id} blog={blog}/>
          )}
        </div>
    )
  }
}

export default App