import React from "react"
import useAuth from "../contexts/auth-context"
import { Outlet, useLocation } from "react-router-dom"

import { useError } from "../contexts/error-context"

export default function PrivateRoute() {
    const authContext = useAuth()
    const location = useLocation()
    const errorContext = useError()

    if (!authContext.isLoggedIn) {
        const errorObject = {
            type: 404,
            location,
        }
        errorContext.setError(errorObject)
    }

    return <Outlet />
}
