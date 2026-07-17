import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Flame, Trophy, Activity, Plus, X, Download, Target, Calendar, Star, BrainCircuit, MessageSquare, Coffee } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [activities, setActivities] = useState([]);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [gamification, setGamification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatNumber = (num) => {
    if (num === null || num === undefined) return 0;
    return Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(num);
  };

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newActivity, setNewActivity] = useState({
    category: 'walking',
    steps: '',
    duration: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchActivities();
    fetchGamification();
    fetchDashboardData();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await api.get('/activities/');
      setActivities(response.data);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    }
  };

  const fetchGamification = async () => {
    try {
      const response = await api.get('/gamification/summary');
      setGamification(response.data);
    } catch (error) {
      console.error('Failed to fetch gamification:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const [analyticsRes] = await Promise.all([
        api.get('/analytics/')
      ]);
      setAnalytics(analyticsRes.data);
      
      // Get AI Recommendation silently
      api.post('/ai/recommendation').then(res => setAiRecommendation(res.data)).catch(console.error);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogActivitySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/activities/', {
        category: newActivity.category,
        steps: Number(newActivity.steps) || 0,
        duration: Number(newActivity.duration) || 0,
        notes: newActivity.notes
      });
      setIsModalOpen(false);
      setNewActivity({ category: 'walking', steps: '', duration: '', notes: '' });
      // Refresh data
      fetchActivities();
      fetchGamification();
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to log activity:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await api.get('/activities/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'fitsteps_activities.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to export CSV:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-emerald-400">Loading your data...</div>;
  }

  // Format chart data
  let chartData = [];
  
  if (selectedDate) {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const dayActivities = activities.filter(a => a.activity_date.startsWith(dateStr));
    
    chartData = dayActivities.map(a => ({
      name: format(parseISO(a.activity_date), 'HH:mm'),
      steps: a.steps
    }));
  } else {
    const grouped = activities.reduce((acc, a) => {
      const dateStr = format(parseISO(a.activity_date), 'MMM dd');
      if (!acc[dateStr]) acc[dateStr] = 0;
      acc[dateStr] += a.steps;
      return acc;
    }, {});
    
    chartData = Object.keys(grouped).map(date => ({
      name: date,
      steps: grouped[date]
    }));
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 sm:gap-0">
          <h1 className="text-3xl font-bold text-white">Your Dashboard</h1>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <button 
              onClick={handleExportCSV}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl font-bold flex justify-center items-center border border-slate-700 transition-colors w-full sm:w-auto"
            >
              <Download className="w-5 h-5 mr-2" />
              Download CSV
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl font-bold flex justify-center items-center transition-colors w-full sm:w-auto"
            >
              <Plus className="w-5 h-5 mr-2" />
              Log Activity
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center shadow-lg hover:border-orange-500/50 transition-colors">
            <div className="bg-orange-500/10 p-4 rounded-xl mr-4">
              <Flame className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">Current Streak</p>
              <h3 className="text-2xl xl:text-3xl font-bold text-white">{formatNumber(gamification?.current_streak)}</h3>
            </div>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center shadow-lg hover:border-yellow-500/50 transition-colors">
            <div className="bg-yellow-500/10 p-4 rounded-xl mr-4">
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">Best Day</p>
              <h3 className="text-2xl xl:text-3xl font-bold text-white" title={analytics?.best_day?.steps}>{formatNumber(analytics?.best_day?.steps)}</h3>
              <p className="text-xs text-slate-500 mt-1">{analytics?.best_day?.date ? format(parseISO(analytics.best_day.date), 'MMM dd, yyyy') : 'No data'}</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center shadow-lg hover:border-purple-500/50 transition-colors">
            <div className="bg-purple-500/10 p-4 rounded-xl mr-4">
              <Star className="w-8 h-8 text-purple-500" />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">Best Week</p>
              <h3 className="text-2xl xl:text-3xl font-bold text-white" title={analytics?.best_week?.steps}>{formatNumber(analytics?.best_week?.steps)}</h3>
              <p className="text-xs text-slate-500 mt-1">{analytics?.best_week?.date ? format(parseISO(analytics.best_week.date), 'MMM dd, yyyy') : 'No data'}</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center shadow-lg hover:border-emerald-500/50 transition-colors">
            <div className="bg-emerald-500/10 p-4 rounded-xl mr-4">
              <Activity className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">Weekly Average</p>
              <h3 className="text-2xl xl:text-3xl font-bold text-white" title={analytics?.weekly_step_average}>{formatNumber(analytics?.weekly_step_average)}</h3>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center shadow-lg hover:border-blue-500/50 transition-colors">
            <div className="bg-blue-500/10 p-4 rounded-xl mr-4">
              <Target className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">Goal Completion</p>
              <h3 className="text-3xl font-bold text-white">{analytics?.goal_completion_rate || 0}%</h3>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-center shadow-lg relative overflow-hidden hover:border-indigo-500/50 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Activity className="w-24 h-24 text-indigo-500" />
            </div>
            <p className="text-indigo-400 text-sm font-medium mb-1 relative z-10 flex items-center">
              AI Daily Goal
            </p>
            <h3 className="text-2xl xl:text-3xl font-bold text-white relative z-10" title={aiRecommendation?.recommended_steps}>
              {aiRecommendation ? formatNumber(aiRecommendation.recommended_steps) : 'Calculating...'}
            </h3>
            {aiRecommendation && <p className="text-xs text-slate-400 mt-2 relative z-10 italic">"{aiRecommendation.reason}"</p>}
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
            <h2 className="text-xl font-bold text-white">Recent Activity Trends</h2>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-3 py-1">
              <Calendar className="w-4 h-4 text-slate-400 mr-2" />
              <DatePicker 
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                placeholderText="Select Date"
                dateFormat="MMM d, yyyy"
                className="bg-transparent text-slate-300 text-sm focus:outline-none focus:ring-0 w-28 cursor-pointer"
                dayClassName={(date) => 
                  activities.some(a => a.activity_date.startsWith(format(date, 'yyyy-MM-dd')))
                    ? "bg-emerald-500 text-white rounded-full"
                    : undefined
                }
              />
              {selectedDate && (
                <button onClick={() => setSelectedDate(null)} className="ml-2 text-slate-500 hover:text-slate-300">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <div className="h-80 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <Line type="monotone" dataKey="steps" stroke="#34d399" strokeWidth={3} dot={{ r: 4, fill: '#34d399', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  <CartesianGrid stroke="#1e293b" strokeDasharray="5 5" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <YAxis 
                    stroke="#64748b" 
                    tick={{fill: '#64748b'}} 
                    axisLine={false} 
                    tickLine={false} 
                    domain={[0, 'auto']}
                    allowDecimals={false}
                    tickFormatter={(value) => {
                      if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
                      if (value >= 1000) return (value / 1000).toFixed(0) + 'K';
                      return value;
                    }}
                    width={50}
                  />
                  <Tooltip 
                    cursor={false}
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

        {/* AI Insights Section */}
        {aiRecommendation && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg border-l-4 border-l-indigo-500">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-500/20 p-3 rounded-lg mr-4">
                  <BrainCircuit className="w-6 h-6 text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Motivation Insights</h2>
              </div>
              <p className="text-slate-300 leading-relaxed italic">
                "{aiRecommendation.motivation_trend}"
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg border-l-4 border-l-emerald-500">
              <div className="flex items-center mb-4">
                <div className="bg-emerald-500/20 p-3 rounded-lg mr-4">
                  <Coffee className="w-6 h-6 text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Activity Break Suggestions</h2>
              </div>
              <ul className="space-y-3">
                {aiRecommendation.activity_breaks?.map((breakIdea, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-emerald-500 mr-2 font-bold">•</span>
                    <span className="text-slate-300">{breakIdea}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Log Activity Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Log Activity</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleLogActivitySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
                <select 
                  value={newActivity.category}
                  onChange={(e) => setNewActivity({...newActivity, category: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="walking">Walking</option>
                  <option value="running">Running</option>
                  <option value="cycling">Cycling</option>
                  <option value="workout">Workout</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Steps</label>
                  <input 
                    type="number"
                    value={newActivity.steps}
                    onChange={(e) => setNewActivity({...newActivity, steps: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="e.g. 5000"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Duration (min)</label>
                  <input 
                    type="number"
                    value={newActivity.duration}
                    onChange={(e) => setNewActivity({...newActivity, duration: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="e.g. 30"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Notes</label>
                <textarea 
                  value={newActivity.notes}
                  onChange={(e) => setNewActivity({...newActivity, notes: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                  rows="3"
                  placeholder="How did it feel?"
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-300 font-medium hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
