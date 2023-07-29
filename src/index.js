import React from 'react'
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { BandBlend } from './components/BandBlend.js'
import "./index.css"


//fixes issue with body color overflow on homepage. If colors get changed this needs to be updated as well with the correct one.
// if (window.location.href === 'http://localhost:3000/') {
//     document.body.style.backgroundColor = '#001220' ;
//   } 

const container = document.getElementById("root")
const root = createRoot(container)
root.render(
    <BrowserRouter>
        <BandBlend />
    </BrowserRouter>
)

