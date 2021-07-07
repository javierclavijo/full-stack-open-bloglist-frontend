import React from "react"
import "@testing-library/jest-dom/extend-expect"
import { render, fireEvent } from "@testing-library/react"
import Blog from "./Blog"

describe("<Blog />", () => {
    const blog = {
        title: "test blog title",
        author: "test author",
        url: "testblog.com",
        likes: 0,
    }
    const user = { name: "test user" }
    let component
    let mockHandler

    beforeEach(() => {
        mockHandler = jest.fn()
        component = render(
            <Blog
                blog={blog}
                blogs={[]}
                setBlogs={mockHandler}
                user={user}
                setMessage={() => null}
            />
        )
    })

    test("renders the blog's title and author, but does not render its url or number of likes by default", () => {
        expect(component.container).toHaveTextContent(blog.title)
        expect(component.container).toHaveTextContent(blog.author)
        expect(component.container).not.toHaveTextContent(blog.url)
        expect(component.container).not.toHaveTextContent(String(blog.likes))
    })

    test("blog url and number of likes are shown when the View button has been clicked", () => {
        const button = component.getByText("View")
        fireEvent.click(button)
        expect(component.container).toHaveTextContent(blog.url)
        expect(component.container).toHaveTextContent(String(blog.likes))
    })
})