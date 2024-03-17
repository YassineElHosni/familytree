import React from "react"
import { LoadingOutlined } from "@ant-design/icons"

import "./index.css"

export default function LoadingScreen() {
    return (
        <div className="loading-screen-container">
            <LoadingOutlined />
        </div>
    )
}
