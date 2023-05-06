import React from "react"
import { WarningOutlined } from "@ant-design/icons"

import { useError } from "../../contexts/error-context"
import "./index.css"

export default function NotFound() {
    const errorContext = useError()

    const GetErrorTitle = () => {
        if (errorContext.error?.type == 404) {
            return "Page not found"
        }
        if (errorContext.error) {
            return "Ops, an unexpected error occured!"
        }
        return "Page not found"
    }

    const GetErrorMessage = () => {
        if (errorContext.error?.type == 404 && errorContext.error?.location?.pathname) {
            return <h2>{errorContext.error.location.pathname}</h2>
        }
        return ""
    }

    return (
        <div className="not-found-container">
            <h1>
                {GetErrorTitle()} <WarningOutlined />
            </h1>
            {GetErrorMessage()}
        </div>
    )
}
