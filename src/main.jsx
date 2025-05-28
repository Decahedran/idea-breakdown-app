import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import Dashboard from './pages/Dashboard';
import ProjectEditor from './pages/ProjectEditor';
import AuthPage from './pages/AuthPage'; // ✅ make sure this import is here
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<AuthPage />} />   {/* ✅ Add this */}
        <Route path="/signup" element={<AuthPage />} />  {/* ✅ And this */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/project/:id" element={<ProjectEditor />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
