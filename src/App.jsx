import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="bg-slate-950 min-h-screen font-sans text-slate-100">
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        {/* Placeholder routes for future expansion */}
        <Route path="/goals" element={<ProtectedRoute><div className="p-8 text-center">Goals Page Coming Soon</div></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
