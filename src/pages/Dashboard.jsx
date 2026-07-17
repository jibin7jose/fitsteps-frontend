import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Flame, Trophy, Activity, Plus } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [activities, setActivities] = useState([]);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [analyticsRes, activitiesRes] = await Promise.all([
        api.get('/analytics/'),
        api.get('/activities/')
      ]);
      setAnalytics(analyticsRes.data);
      
      // Sort activities to most recent first, take last 7 for chart
      const sortedActs = activitiesRes.data.sort((a, b) => new Date(a.activity_date) - new Date(b.activity_date));
      setActivities(sortedActs.slice(-7));

      // Get AI Recommendation silently
      api.post('/ai/recommendation').then(res => setAiRecommendation(res.data)).catch(console.error);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-emerald-400">Loading your data...</div>;
  }

  // Format chart data
  const chartData = activities.map(a => ({
    name: format(parseISO(a.activity_date), 'MMM dd'),
    steps: a.steps
  }));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Your Dashboard</h1>
          <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl font-bold flex items-center transition-colors">
            <Plus className="w-5 h-5 mr-2" />
            Log Activity
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center shadow-lg">
            <div className="bg-orange-500/10 p-4 rounded-xl mr-4">
              <Flame className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">Weekly Average</p>
              <h3 className="text-3xl font-bold text-white">{analytics?.weekly_step_average || 0}</h3>
            </div>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center shadow-lg">
            <div className="bg-yellow-500/10 p-4 rounded-xl mr-4">
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">Best Day</p>
              <h3 className="text-3xl font-bold text-white">{analytics?.best_day?.steps || 0}</h3>
              <p className="text-xs text-slate-500 mt-1">{analytics?.best_day?.date ? format(parseISO(analytics.best_day.date), 'MMM dd, yyyy') : 'No data'}</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-center shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Activity className="w-24 h-24 text-emerald-500" />
            </div>
            <p className="text-emerald-400 text-sm font-medium mb-1 relative z-10 flex items-center">
              AI Daily Goal
            </p>
            <h3 className="text-3xl font-bold text-white relative z-10">{aiRecommendation ? aiRecommendation.recommended_steps : 'Calculating...'}</h3>
            {aiRecommendation && <p className="text-xs text-slate-400 mt-2 relative z-10 italic">"{aiRecommendation.reason}"</p>}
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold text-white mb-6">Recent Activity Trends</h2>
          <div className="h-80 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <Line type="monotone" dataKey="steps" stroke="#34d399" strokeWidth={3} dot={{ r: 4, fill: '#34d399', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  <CartesianGrid stroke="#1e293b" strokeDasharray="5 5" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '0.75rem', color: '#f1f5f9' }}
                    itemStyle={{ color: '#34d399', fontWeight: 'bold' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                Not enough data to display chart. Log some activities!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
