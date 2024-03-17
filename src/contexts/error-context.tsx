import React, { useContext, useState, useEffect, Dispatch, SetStateAction } from "react"
import { Location } from "react-router-dom"

import NotFound from "../routes/NotFound"

type ErrorStateType = { type: number; location: Location } | undefined

type ErrorContextType = {
    error: ErrorStateType
    setError: Dispatch<SetStateAction<ErrorStateType>>
}

const ErrorContext = React.createContext<ErrorContextType>({ error: undefined, setError: () => {} })

type ErrorContextProviderProps = {
    children: React.ReactNode
}

export default function ErrorContextProvider({ children }: ErrorContextProviderProps) {
    const [error, setError] = useState<ErrorStateType>()

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
