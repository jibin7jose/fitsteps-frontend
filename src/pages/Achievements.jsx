import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Achievements() {
  const [gamification, setGamification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGamification = async () => {
      try {
        const response = await api.get('/gamification/summary');
        setGamification(response.data);
      } catch (error) {
        console.error('Failed to fetch gamification data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGamification();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!gamification) {
    return <div className="text-center text-slate-400 mt-10">Unable to load achievements.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white tracking-tight">Achievements</h1>
        <p className="text-slate-400">Track your progress and collect badges as you reach your fitness goals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 backdrop-blur-sm flex flex-col items-center justify-center text-center hover:border-emerald-500/50 transition-colors">
          <div className="text-5xl mb-2">🔥</div>
          <div className="text-sm font-medium text-emerald-400 uppercase tracking-wider mb-1">Current Streak</div>
          <div className="text-5xl font-black text-white">{gamification.current_streak} <span className="text-2xl text-slate-400 font-medium">days</span></div>
        </div>
        
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 backdrop-blur-sm flex flex-col items-center justify-center text-center hover:border-emerald-500/50 transition-colors">
          <div className="text-5xl mb-2">🏆</div>
          <div className="text-sm font-medium text-emerald-400 uppercase tracking-wider mb-1">Longest Streak</div>
          <div className="text-5xl font-black text-white">{gamification.longest_streak} <span className="text-2xl text-slate-400 font-medium">days</span></div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Earned Badges</h2>
        {gamification.earned_badges.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gamification.earned_badges.map((ub) => (
              <div key={ub.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700 text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-5xl mb-4 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">{ub.badge.icon_url}</div>
                <h3 className="text-white font-bold mb-1">{ub.badge.name}</h3>
                <p className="text-xs text-slate-400 mb-3">{ub.badge.description}</p>
                <div className="text-[10px] text-emerald-500/80 uppercase tracking-wider">
                  Earned {new Date(ub.earned_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-800/30 rounded-xl p-10 border border-slate-700/50 text-center border-dashed">
            <div className="text-4xl mb-4 opacity-50">🌱</div>
            <h3 className="text-white font-medium mb-2">No Badges Yet</h3>
            <p className="text-slate-400 text-sm">Log your first activity to start earning badges!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Achievements;
