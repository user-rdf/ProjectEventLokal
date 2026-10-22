import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // Tambahkan baris ini
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* Tambahkan baris ini */}
      <App />
    </BrowserRouter> {/* Tambahkan baris ini */}
  </React.StrictMode>,
)