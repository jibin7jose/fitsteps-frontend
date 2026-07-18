import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Activity, LogOut, LayoutDashboard, Target, Users, Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Link>
            <Link to="/goals" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors">
              <Target className="w-4 h-4 mr-2" />
              Goals
            </Link>
            <Link to="/achievements" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors">
              <span className="w-4 h-4 mr-2 text-center leading-none">🏆</span>
              Achievements
            </Link>
            <Link to="/leaderboard" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors">
              <Users className="w-4 h-4 mr-2" />
              Leaderboard
            </Link>
            
            <div className="relative ml-4" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 text-slate-300 hover:text-white focus:outline-none transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold border border-slate-700 text-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-sm font-medium hidden lg:block">{user?.name || 'User'}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-lg shadow-lg py-1 z-50">
                  <button 
                    onClick={() => { setDropdownOpen(false); handleLogout(); }}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 flex items-center transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 absolute w-full shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link onClick={() => setIsOpen(false)} to="/" className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center">
              <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
            </Link>
            <Link onClick={() => setIsOpen(false)} to="/goals" className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center">
              <Target className="w-5 h-5 mr-3" /> Goals
            </Link>
            <Link onClick={() => setIsOpen(false)} to="/achievements" className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center">
              <span className="w-5 h-5 mr-3 text-center leading-none">🏆</span> Achievements
            </Link>
            <Link onClick={() => setIsOpen(false)} to="/leaderboard" className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center">
              <Users className="w-5 h-5 mr-3" /> Leaderboard
            </Link>
            <button 
              onClick={() => { setIsOpen(false); handleLogout(); }}
              className="w-full text-left text-red-400 hover:text-red-300 block px-3 py-2 rounded-md text-base font-medium flex items-center"
            >
              <LogOut className="w-5 h-5 mr-3" /> Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
