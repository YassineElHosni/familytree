import React from "react"

import Navbar from "./Navbar"
import MemberList from "./MemberList"
import TreeCanvas from "../Canvas/TreeCanvas"

export default function Dashboard() {
    return (
        <>
            <Navbar />
            <div>
                <MemberList />
                <TreeCanvas />
            </div>
        </>
    )
}
