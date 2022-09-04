import React, { useContext, useState, useEffect } from "react"

import { auth } from "../firebase.ts"

const AuthContext = React.createContext({
    currentUser: {},
    isLoggedIn: false,
    loading: true,
    login: () => {},
    signup: () => {},
    logout: () => {},
    resetPassword: () => {},
    updateEmail: () => {},
    updatePassword: () => {},
})

export function AuthContextProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [isLoading, setIsLoading] = useState(true)

    const [isLoggedIn, setIsLoggedIn] = useState(false)

    function signup(email, password) {
        return auth.createUserWithEmailAndPassword(email, password)
    }

    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password)
    }

    function logout() {
        return auth.signOut()
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email)
    }

    function updateEmail(email) {
        return currentUser.updateEmail(email)
    }

    function updatePassword(password) {
        return currentUser.updatePassword(password)
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user)
            setIsLoading(false)
        })

        return unsubscribe
    }, [])

    useEffect(() => {
        if (currentUser) {
            setIsLoggedIn(true)
        } else {
            setIsLoggedIn(false)
        }
    }, [currentUser])

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                isLoggedIn,
                login,
                signup,
                logout,
                resetPassword,
                updateEmail,
                updatePassword,
            }}
        >
            {!isLoading && children}
        </AuthContext.Provider>
    )
}

export default useAuth = () => useContext(AuthContext)
