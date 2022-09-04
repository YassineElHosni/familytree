import React from "react"
import { SearchOutlined } from "@ant-design/icons"

export default function SearchInput({ onChange, placeholder }) {
    return (
        <div className="Search">
            <span className="SearchSpan">
                <SearchOutlined />
            </span>
            <input className="SearchInput" type="text" onChange={onChange} placeholder={placeholder} />
        </div>
    )
}
