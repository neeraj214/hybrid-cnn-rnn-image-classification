import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Layout from './components/Layout'
import Home from './pages/Home'
import TryModel from './pages/TryModel'
import Architecture from './pages/Architecture'
import Metrics from './pages/Metrics'
import Dataset from './pages/Dataset'
import About from './pages/About'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/try-model" element={<TryModel />} />
        <Route path="/architecture" element={<Architecture />} />
        <Route path="/metrics" element={<Metrics />} />
        <Route path="/dataset" element={<Dataset />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
