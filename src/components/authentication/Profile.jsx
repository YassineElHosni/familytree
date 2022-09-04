import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import useAuth from "../../contexts/auth-context"

export default function Dashboard() {
    const navigate = useNavigate()

    const [error, setError] = useState("")
    const { currentUser, logout } = useAuth()

    async function handleLogout() {
        setError("")

        try {
            await logout()
            navigate("/login")
        } catch {
            setError("Failed to log out")
        }
    }

    return (
        <>
            <div>
                <h2 className="text-center mb-4">Profile</h2>
                {error && <div>{error}</div>}
                <strong>Email:</strong> {currentUser.email}
                <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
                    Update Profile
                </Link>
            </div>
            <div className="w-100 text-center mt-2">
                <button variant="link" onClick={handleLogout}>
                    Log Out
                </button>
            </div>
        </>
    )
}
