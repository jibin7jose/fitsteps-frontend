import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Trophy, Medal, Crown } from 'lucide-react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get('/leaderboard/');
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-slate-300" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="text-slate-500 font-bold w-6 text-center">{rank}</span>;
  };

  const getRankStyle = (rank, isCurrentUser) => {
    let baseStyle = "flex items-center justify-between p-4 rounded-xl mb-3 transition-colors ";
    
    if (isCurrentUser) {
      baseStyle += "bg-emerald-900/30 border border-emerald-500/50 ";
    } else {
      baseStyle += "bg-slate-900 border border-slate-800 hover:bg-slate-800 ";
    }
    
    return baseStyle;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="text-center mb-10">
        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-white tracking-tight">Weekly Leaderboard</h1>
        <p className="text-slate-400 mt-2">See how your weekly steps stack up against your friends!</p>
      </div>

      <div className="bg-slate-950 p-6 rounded-3xl shadow-2xl border border-slate-800">
        <div className="flex justify-between items-center px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          <span>Rank & Friend</span>
          <span>Steps</span>
        </div>
        
        <div className="space-y-1 overflow-y-auto max-h-[65vh] pr-4 custom-scrollbar">
          {leaderboard.map((user) => (
            <div key={user.id} className={getRankStyle(user.rank, user.is_current_user)}>
              <div className="flex items-center flex-1 min-w-0">
                <div className="w-8 sm:w-10 flex justify-center mr-2 sm:mr-4 shrink-0">
                  {getRankIcon(user.rank)}
                </div>
                <div className="flex items-center min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold mr-3 sm:mr-4 border border-slate-700 text-sm sm:text-base">
                    {user.name.charAt(0)}
                  </div>
                  <span className={`font-bold ${user.is_current_user ? 'text-emerald-400' : 'text-slate-200'} text-sm sm:text-lg truncate`}>
                    {user.name}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0 ml-4">
                <span className="text-xl sm:text-2xl font-black text-white">{user.steps.toLocaleString()}</span>
                <span className="text-[10px] sm:text-xs text-slate-500 block">steps</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
