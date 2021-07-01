import axios from 'axios'

const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
    token = `bearer ${newToken}`
}

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = async newObject => {
    const config = {headers: {Authorization: token}}
    const response = await axios.post(baseUrl, newObject, config)
    return response.data
}

const addLike = async (blog) => {
    const config = {headers: {Authorization: token}}
    const updatedBlog = {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1
    }
    const response = await axios.put(baseUrl + "/" + blog.id, updatedBlog, config
    )
    return response.data
}

const deleteBlog = async (blog) => {
    const config = {headers: {Authorization: token}}
    return await axios.delete(baseUrl + '/' + blog.id, config)
}

export default {getAll, setToken, create, addLike, deleteBlog}