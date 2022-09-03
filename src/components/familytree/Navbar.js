import React from "react"
import { Navbar, Nav } from "react-bootstrap"
import { Link } from "react-router-dom"

export default function NavbarComponent() {
    return (
        <Navbar bg="dark" expand="lg" variant="dark">
            <Navbar.Brand as={Link} to="/">
                Family Tree
            </Navbar.Brand>
            <Nav>
                <Nav.Link as={Link} to="/user">
                    Profile
                </Nav.Link>
            </Nav>
        </Navbar>
    )
}
