describe("Blog app", function () {

    describe("when logged in", function () {

        beforeEach(function () {
            cy.request("POST", "http://localhost:3003/api/testing/reset")
            const user = {
                name: "Paco Jones",
                username: "paco",
                password: "password"
            }
            cy.request("POST", "http://localhost:3003/api/users/", user)
            cy.visit("http://localhost:3000")
        })
    })

    it("shows login form when not logged in", function () {
        cy.visit("http://localhost:3000")
        cy.get("input[name=\"Username\"]").should("be.visible")
        cy.get("input[name=\"Password\"]").should("be.visible")

    })
})