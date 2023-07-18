import React from 'react'
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { BandBlend } from './components/BandBlend.js'
import "./index.css"


const container = document.getElementById("root")
const root = createRoot(container)
root.render(
    <BrowserRouter>
        <BandBlend />
    </BrowserRouter>
)

