import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import './App.css';

function App() {
  return (
        <Router>
            <Switch>
              <Route path="/" component={Signup} />
            </Switch>
        </Router>
  )
}

export default App
