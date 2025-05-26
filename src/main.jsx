import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import Dashboard from './pages/Dashboard';
import ProjectEditor from './pages/ProjectEditor'; // ✅ NEW IMPORT
import './index.css'; // MUST be imported for Tailwind to apply


ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/project/:id" element={<ProjectEditor />} /> {/* ✅ NEW ROUTE */}
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
