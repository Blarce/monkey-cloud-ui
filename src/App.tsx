import React from 'react'

import './App.css'
//import { SignUpPage } from './pages/SignUpPage/SignUpPage'
import {StartPage} from './pages/StartPage/StartPage'
const rootContainerClassName = 'root-container'
const App = () => {
  return (
    <div className={rootContainerClassName}>
      <StartPage />
    </div>
  )
}

export default App
