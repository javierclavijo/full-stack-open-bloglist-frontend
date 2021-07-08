describe("Blog app", function () {

    const user = {
        name: "Paco Jones",
        username: "paco",
        password: "password"
    }

    const blog = {
        title: "Paco's blog",
        author: "Paco Jones",
        url: "paco.com/blog"
    }

    const blogWithMostLikes = {
        title: "Manue's blog",
        author: "Manue",
        url: "manue.com/blog",
        likes: 12,
    }

    const blogWithSomeLikes = {
        title: "Pepe's blog",
        author: "Pepe",
        url: "pepe.com/blog",
        likes: 3,
    }

    describe("when logged in", function () {
        beforeEach(function () {
            cy.request("POST", "http://localhost:3003/api/login/",
                { username: user.username, password: user.password }
            ).then(response => {
                localStorage.setItem("bloglistUser", JSON.stringify(response.body))
                cy.visit("http://localhost:3000/")
            })
        })

        it("allows creating a new blog", function () {
            cy.get("button[name=\"ShowBlogForm\"]").click()
            cy.get("input[name=\"NewBlogTitle\"]").type(blog.title)
            cy.get("input[name=\"NewBlogAuthor\"]").type(blog.author)
            cy.get("input[name=\"NewBlogURL\"]").type(blog.url)
            cy.get("#createBlog").click()
            cy.get("#message").should("contain.text", `New blog: '${blog.title}', by ${blog.author}, at ${blog.url}`)
            cy.get(".blog").should("have.length", 1)
                .and("contain.text", blog.title)
                .and("contain.text", blog.author)
        })

        describe("when blogs have been added", function () {
            beforeEach(function () {
                cy.request({
                    method: "POST",
                    url: "http://localhost:3003/api/blogs/",
                    body: blog,
                    headers: {
                        "Authorization": `bearer ${JSON.parse(localStorage.getItem("bloglistUser")).token}`
                    }
                })
                cy.request({
                    method: "POST",
                    url: "http://localhost:3003/api/blogs/",
                    body: blogWithMostLikes,
                    headers: {
                        "Authorization": `bearer ${JSON.parse(localStorage.getItem("bloglistUser")).token}`
                    }
                })
                cy.request({
                    method: "POST",
                    url: "http://localhost:3003/api/blogs/",
                    body: blogWithSomeLikes,
                    headers: {
                        "Authorization": `bearer ${JSON.parse(localStorage.getItem("bloglistUser")).token}`
                    }
                })
                cy.visit("http://localhost:3000/")
            })

            it("allows liking a blog", function () {
                cy.get(".viewBlog:first").click()
                cy.get(".blog:first").should("contain.text", `Likes: ${blogWithMostLikes.likes}`)
                cy.get(".likeBlog").click()
                cy.get(".blog:first").should("contain.text", `Likes: ${blogWithMostLikes.likes + 1}`)
            })

            it("allows users to delete blogs they have created", function () {
                cy.get(".viewBlog:first").click()
                cy.get(".deleteBlog:first").click()
                cy.on("window:confirm", () => true)
                cy.should("not.contain.text", blogWithMostLikes.title)
                cy.get(".blog").should("have.length", 2)
            })

            it("displays blogs ordered according to likes (descending)", function () {
                cy.get(".viewBlog").click({ multiple: true })
                cy.get(".numberOfLikes").then($blogs => {
                    const blogLikes = [...$blogs.map(function () {
                        return Number(this.textContent)
                    })]
                    expect(blogLikes).to.equal(blogLikes.sort((b1, b2) => b2 - b1))
                })
            })

        })

    })

    beforeEach(function () {
        cy.request("POST", "http://localhost:3003/api/testing/reset")
        cy.request("POST", "http://localhost:3003/api/users/", user)
        cy.visit("http://localhost:3000")
    })

    it("shows login form when not logged in", function () {
        cy.get("input[name=\"Username\"]").should("be.visible")
        cy.get("input[name=\"Password\"]").should("be.visible")
    })

    it("allows logging in with correct credentials", function () {
        cy.get("input[name=\"Username\"]").type(user.username)
        cy.get("input[name=\"Password\"]").type(user.password)
        cy.get("#loginButton").click()
        cy.get("#message").should("contain.text", `Successfully logged in as ${user.name}`)
    })

    it("does not allow logging in with incorrect credentials", function () {
        cy.get("input[name=\"Username\"]").type("wrongUser")
        cy.get("input[name=\"Password\"]").type("wrongPassword")
        cy.get("#loginButton").click()
        cy.get("#message").should("contain.text", "Wrong credentials!")
    })
})