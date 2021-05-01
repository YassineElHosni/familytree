import React from 'react'
import { Container } from 'react-bootstrap'
import TreeCanvas from '../Canvas/TreeCanvas'
import MemberList from './MemberList'
import Navbar from './Navbar'

export default function Dashboard() {
    return (
        <>
            <Navbar/>
            <Container fluid>
                <div>
                    <MemberList/>
                </div>
                <div>
                    <TreeCanvas />
                </div>
            </Container>
        </>
    )
}
