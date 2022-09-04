import React from "react"
import { Routes, Route } from "react-router-dom"

import useAuth from "./contexts/auth-context"
import PrivateRoute from "./routes/PrivateRoute"
import Signup from "./components/authentication/Signup"
import Login from "./components/authentication/Login"
import ForgotPassword from "./components/authentication/ForgotPassword"
import Dashboard from "./components/familytree/Dashboard"
import Profile from "./components/authentication/Profile"
import UpdateProfile from "./components/authentication/UpdateProfile"
import LoadingScreen from "./components/common/LoadingScreen"
import "./App.css"

function App() {
    const authContext = useAuth()

    if (authContext.isLoading) {
        return <LoadingScreen />
    }

    return (
        <Router>
            <Routes>
                {/* Authentication */}
                <Route path="/signup" element={Signup} />
                <Route path="/login" element={Login} />
                <Route path="/forgot-password" element={ForgotPassword} />

                {/* Familytree */}
                <Route element={PrivateRoute}>
                    <Route path="/" element={Dashboard} />
                    {/* Profile */}
                    <Route path="/user" element={Profile} />
                    <Route path="/update-profile" element={UpdateProfile} />
                </Route>
            </Routes>
        </Router>
    )
}

export default App
