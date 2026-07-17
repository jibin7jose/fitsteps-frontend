import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Target, Plus, CheckCircle, Clock, Activity, Edit2, Trash2, X, Save } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [goalType, setGoalType] = useState('daily_steps');
  const [target, setTarget] = useState(10000);
  const [frequency, setFrequency] = useState('daily');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [editTarget, setEditTarget] = useState('');

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await api.get('/goals/');
      setGoals(response.data);
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/goals/', {
        goal_type: goalType,
        target: Number(target),
        frequency: frequency,
      });
      // Reset form
      setGoalType('daily_steps');
      setTarget(10000);
      setFrequency('daily');
      
      // Refresh list
      fetchGoals();
    } catch (error) {
      console.error('Failed to create goal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGoal = async (id) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) return;
    try {
      await api.delete(`/goals/${id}`);
      fetchGoals();
    } catch (error) {
      console.error('Failed to delete goal:', error);
    }
  };

  const handleUpdateGoal = async (id) => {
    try {
      await api.put(`/goals/${id}`, { target: Number(editTarget) });
      setEditingGoal(null);
      fetchGoals();
    } catch (error) {
      console.error('Failed to update goal:', error);
    }
  };

  const getGoalIcon = (type) => {
    if (type === 'daily_steps') return <Target className="w-8 h-8 text-emerald-400" />;
    if (type === 'active_minutes') return <Activity className="w-8 h-8 text-orange-400" />;
    return <Target className="w-8 h-8 text-emerald-400" />;
  };

  const getGoalTitle = (type) => {
    if (type === 'daily_steps') return 'Steps Goal';
    if (type === 'active_minutes') return 'Active Minutes';
    return 'Fitness Goal';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center mb-8">
        <Target className="w-8 h-8 text-emerald-500 mr-3" />
        <h1 className="text-3xl font-bold text-white tracking-tight">Your Goals</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Goal Form */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <Plus className="w-5 h-5 mr-2 text-emerald-500" />
              Create New Goal
            </h2>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Goal Type</label>
                <select 
                  value={goalType} 
                  onChange={(e) => setGoalType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="daily_steps">Steps Goal</option>
                  <option value="active_minutes">Active Minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Target</label>
                <input 
                  type="number" 
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Frequency</label>
                <select 
                  value={frequency} 
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Set Goal'}
              </button>
            </form>
          </div>
        </div>

        {/* Goals List */}
        <div className="lg:col-span-2 overflow-y-auto max-h-[75vh] pr-4 custom-scrollbar">
          <div className="space-y-4">
            {goals.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 p-10 rounded-2xl text-center shadow-lg border-dashed">
                <Target className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">No Active Goals</h3>
                <p className="text-slate-400">Create your first goal to start tracking your progress!</p>
              </div>
            ) : (
              goals.map((goal) => (
                <div key={goal.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between hover:border-emerald-500/30 transition-colors group">
                  <div className="flex items-center mb-4 sm:mb-0">
                    <div className="bg-slate-950 p-4 rounded-xl mr-5 group-hover:scale-110 transition-transform">
                      {getGoalIcon(goal.goal_type)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{getGoalTitle(goal.goal_type)}</h3>
                      <div className="flex items-center text-sm text-slate-400 mt-1">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="capitalize">{goal.frequency}</span>
                        <span className="mx-2">•</span>
                        <span>Started {format(parseISO(goal.start_date), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-between sm:justify-end sm:space-x-4 bg-slate-950/50 p-4 sm:p-0 sm:bg-transparent rounded-lg mt-4 sm:mt-0">
                    {editingGoal === goal.id ? (
                      <div className="flex items-center space-x-2">
                        <input 
                          type="number"
                          value={editTarget}
                          onChange={(e) => setEditTarget(e.target.value)}
                          className="w-24 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-white"
                        />
                        <button onClick={() => handleUpdateGoal(goal.id)} className="text-emerald-500 hover:text-emerald-400 p-1">
                          <Save className="w-5 h-5" />
                        </button>
                        <button onClick={() => setEditingGoal(null)} className="text-slate-400 hover:text-slate-300 p-1">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-slate-400 font-medium mb-1">Target</p>
                          <p className="text-2xl font-black text-white">{goal.target.toLocaleString()}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button onClick={() => { setEditingGoal(goal.id); setEditTarget(goal.target); }} className="text-slate-400 hover:text-emerald-400 p-2 rounded-lg hover:bg-slate-800 transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteGoal(goal.id)} className="text-slate-400 hover:text-red-400 p-2 rounded-lg hover:bg-slate-800 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goals;
