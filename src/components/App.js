import React from "react"
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Profile from "./authentication/Profile"
import Login from "./authentication/Login"
import Signup from "./authentication/Signup"
import PrivateRoute from "./authentication/PrivateRoute"
import ForgotPassword from "./authentication/ForgotPassword"
import UpdateProfile from "./authentication/UpdateProfile"

import "./App.css"
import Dashboard from "./familytree/Dashboard"

function App() {
    return (
        <Router>
            <AuthProvider>
                <Switch>
                    {/* Familytree */}
                    <PrivateRoute exact path="/" component={Dashboard}></PrivateRoute>
                    {/* Profile */}
                    <PrivateRoute path="/user" component={Profile} />
                    <PrivateRoute path="/update-profile" component={UpdateProfile} />

                    {/* Authentication */}
                    <Route path="/signup" component={Signup} />
                    <Route path="/login" component={Login} />
                    <Route path="/forgot-password" component={ForgotPassword} />
                </Switch>
            </AuthProvider>
        </Router>
    )
}

export default App
