import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Layout from './pages/Layout'
import NoMatch from './pages/NoMatch'

import './App.css'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="*" element={<NoMatch />} />
            </Route>
        </Routes>
    )
}

export default App
