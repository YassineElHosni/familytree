import React, { useContext, useState, useEffect } from "react"

import NotFound from "../routes/NotFound"

const ErrorContext = React.createContext({ error: false, setError: () => {} })

export default function ErrorContextProvider(props) {
    const [error, setError] = useState()

    useEffect(() => {
        const beforeunload_listener = document.addEventListener("beforeunload", () => setError())

        return () => {
            document.removeEventListener("beforeunload", beforeunload_listener)
        }
    })

    return (
        <ErrorContext.Provider
            value={{
                error,
                setError,
            }}
        >
            {error ? <NotFound /> : props.children}
        </ErrorContext.Provider>
    )
}

export const useError = () => useContext(ErrorContext)
