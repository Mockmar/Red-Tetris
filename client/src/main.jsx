import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path="/:room/:playerName" element={<App />} />
      <Route path="/" element={<Navigate to="/default/player" replace />} />
    </Routes>
  </Router>
)