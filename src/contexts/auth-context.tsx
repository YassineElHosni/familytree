import React, { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import * as AuthServices from "../services/auth.services"
import { AuthContextType } from "../types/auth-context.types"

// import { auth } from "../firebase.ts"

const AuthContext = React.createContext<AuthContextType>({
    isLoggedIn: false,
    isLoading: true,
    login: () => {},
    signup: () => {},
    logout: () => {},
})

type AuthContextProviderProps = {
    children: React.ReactNode
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(true)

    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        const token = localStorage.getItem("token")
        if (typeof token === "string" && token !== "") {
            setIsLoggedIn(true)
            navigate("/")
        } else {
            setIsLoggedIn(false)
            navigate("/login")
        }
        setIsLoading(false)
    }, [navigate])

    const signup = async (email: string, password: string) => {
        try {
            const result = await AuthServices.signup(email, password)
            console.log("signup - result", result)
            const token = result?.data?.data?.token
            localStorage.setItem("token", token)
        } catch (error) {
            throw error
        }
    }

    const login = async (email: string, password: string) => {
        try {
            const result = await AuthServices.login(email, password)
            console.log("login - result", result)
            const token = result?.data?.data?.token
            localStorage.setItem("token", token)
        } catch (error) {
            throw error
        }
    }

    const logout = async (): Promise<void> => {
        try {
            localStorage.removeItem("token")
            navigate("/login")
        } catch (error) {
            throw error
        }
    }

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                isLoading,
                login,
                signup,
                logout,
            }}
        >
            {!isLoading && children}
        </AuthContext.Provider>
    )
}

const useAuth = () => useContext(AuthContext)
export default useAuth
