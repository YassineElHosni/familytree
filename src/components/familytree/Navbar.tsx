import { NavLink } from "react-router-dom"
import { UserOutlined } from "@ant-design/icons"

export default function NavbarComponent() {
    return (
        <nav>
            <NavLink to="/">Family Tree</NavLink>
            <NavLink to="/user">
                Profile <UserOutlined />
            </NavLink>
        </nav>
    )
}
