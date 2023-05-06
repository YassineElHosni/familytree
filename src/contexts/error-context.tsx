import React, { useContext, useState, useEffect, Dispatch, SetStateAction } from "react"

import NotFound from "../routes/NotFound"

type ErrorContextType = {
    error: { type: number; location: { pth: string } } | undefined
    setError: Dispatch<SetStateAction<undefined>>
}

const ErrorContext = React.createContext<ErrorContextType>({ error: undefined, setError: () => {} })

type ErrorContextProviderProps = {
    children: React.ReactNode
}

export default function ErrorContextProvider({ children }: ErrorContextProviderProps) {
    const [error, setError] = useState()

    useEffect(() => {
        const beforeunload_callback = () => setError(undefined)
        document.addEventListener("beforeunload", beforeunload_callback)

        return () => {
            document.removeEventListener("beforeunload", beforeunload_callback)
        }
    })

    return (
        <ErrorContext.Provider
            value={{
                error,
                setError,
            }}
        >
            {error ? <NotFound /> : children}
        </ErrorContext.Provider>
    )
}

export const useError = () => useContext(ErrorContext)
