import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Activity, LogOut, LayoutDashboard, Target } from 'lucide-react';

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-emerald-400 mr-3" />
            <span className="text-xl font-bold text-white tracking-tight">FitSteps</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Link>
            <Link to="/goals" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors">
              <Target className="w-4 h-4 mr-2" />
              Goals
            </Link>
            <button 
              onClick={handleLogout}
              className="ml-4 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm font-medium flex items-center border border-slate-700 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
