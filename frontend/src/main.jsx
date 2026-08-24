import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom' // <-- NEW: Importing the Router!

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* NEW: Wrapping the app in BrowserRouter so your <Link> tags work! */}
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)