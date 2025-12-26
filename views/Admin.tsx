import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { DollarSign, Shield, Activity, TrendingUp, ArrowUpRight, ArrowDownRight, MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { askAnalyst } from '../utils/ai';

const dataRevenue = [
  { name: '10am', rev: 400 },
  { name: '12pm', rev: 900 },
  { name: '2pm', rev: 1500 },
  { name: '4pm', rev: 2100 },
];

const dataRefunds = [
  { name: 'M', count: 12 },
  { name: 'T', count: 8 },
  { name: 'W', count: 15 },
  { name: 'T', count: 3 },
  { name: 'F', count: 1 }, 
];

const liveFeed = [
    { id: '#922', status: 'Verified', loc: 'Indiranagar', time: 'Now', color: 'text-emerald-500' },
    { id: '#921', status: 'Processing', loc: 'Koramangala', time: '10s', color: 'text-yellow-500' },
    { id: '#920', status: 'Delivered', loc: 'Whitefield', time: '2m', color: 'text-blue-500' },
    { id: '#919', status: 'Verified', loc: 'HSR Layout', time: '5m', color: 'text-emerald-500' },
];

const KPICard = ({ title, value, change, isPositive, icon: Icon }: any) => (
  <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-4 flex flex-col justify-between h-full">
     <div className="flex justify-between items-start mb-3">
        <div className="p-2 bg-[#27272a] rounded-lg text-white">
            <Icon size={18} />
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
            {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            {change}
        </div>
     </div>
     <div>
         <div className="text-slate-500 text-xs font-medium mb-0.5">{title}</div>
         <div className="text-xl font-bold text-white tracking-tight">{value}</div>
     </div>
  </div>
);

export const AdminView = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
      {role: 'model', text: 'Hello. I am the Strategic Analyst module (Pro 1.5). How can I optimize the network today?'}
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);

  const handleSend = async () => {
      if (!input.trim()) return;
      const userMsg = input;
      setInput('');
      setMessages(prev => [...prev, {role: 'user', text: userMsg}]);
      setThinking(true);

      const result = await askAnalyst(userMsg);
      
      setMessages(prev => [...prev, {role: 'model', text: result.text || 'Analysis failed.'}]);
      setThinking(false);
  };

  return (
    <div className="space-y-6 pb-20 relative min-h-full">
      <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">Dashboard</h2>
          <div className="flex items-center gap-1.5">
             <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
             <span className="text-xs text-slate-400">System Active</span>
          </div>
      </div>

      {/* KPI Row - Scrollable horizontally if needed, or grid */}
      <div className="grid grid-cols-2 gap-3">
          <KPICard title="Revenue" value="₹1.2L" change="18%" isPositive={true} icon={DollarSign} />
          <KPICard title="Saved" value="₹45k" change="12%" isPositive={false} icon={Shield} />
      </div>
      <div className="grid grid-cols-1">
          <KPICard title="Network Integrity" value="99.8%" change="0.4%" isPositive={true} icon={Activity} />
      </div>

      {/* Charts Row */}
      <div className="space-y-4">
          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-white mb-4">Revenue Trend</h3>
              <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dataRevenue}>
                          <defs>
                              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                          <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} dy={5} />
                          <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                            itemStyle={{ color: '#3b82f6' }}
                          />
                          <Area type="monotone" dataKey="rev" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                      </AreaChart>
                  </ResponsiveContainer>
              </div>
          </div>

          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-white mb-4">Incident Frequency</h3>
              <div className="h-48">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dataRefunds}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                          <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} dy={5} />
                          <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip 
                            cursor={{fill: '#27272a'}}
                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} 
                          />
                          <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={30} />
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </div>
      </div>

      {/* Live Feed */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Recent Activity</h3>
          <div className="divide-y divide-[#27272a]">
              {liveFeed.map((item, i) => (
                  <div key={i} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                          <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'Processing' ? 'bg-yellow-500' : item.status === 'Delivered' ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
                          <div>
                              <div className="text-white text-xs font-medium">{item.id}</div>
                              <div className="text-slate-500 text-[10px]">{item.loc}</div>
                          </div>
                      </div>
                      <div className="text-right">
                          <div className={`text-xs font-medium ${item.color}`}>{item.status}</div>
                          <div className="text-slate-500 text-[10px]">{item.time}</div>
                      </div>
                  </div>
              ))}
          </div>
      </div>

      {/* FAB Chat Toggle */}
      <div className="fixed bottom-6 right-4 z-50">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setChatOpen(!chatOpen)}
            className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/30 text-white border border-white/20"
          >
              {chatOpen ? <X size={24} /> : <Sparkles size={24} />}
          </motion.button>
      </div>

      {/* Chat Drawer */}
      <AnimatePresence>
          {chatOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="fixed bottom-24 right-4 left-4 h-[60vh] max-h-[500px] bg-[#09090b]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-40"
              >
                  <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-2">
                      <Sparkles size={16} className="text-blue-400" />
                      <span className="text-sm font-bold text-white">Strategic Copilot</span>
                      <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded ml-auto">Thinking Mode</span>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map((m, i) => (
                          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-[#27272a] text-slate-200'}`}>
                                  {m.text}
                              </div>
                          </div>
                      ))}
                      {thinking && (
                           <div className="flex justify-start">
                               <div className="bg-[#27272a] rounded-2xl p-3 flex gap-1">
                                   <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                                   <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-75"></span>
                                   <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-150"></span>
                               </div>
                           </div>
                      )}
                  </div>

                  <div className="p-3 border-t border-white/5 bg-black/40">
                      <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask about logistics..."
                            className="flex-1 bg-[#18181b] border border-[#27272a] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                          />
                          <button 
                            onClick={handleSend}
                            disabled={thinking}
                            className="bg-blue-600 text-white p-3 rounded-xl disabled:opacity-50"
                          >
                              <Send size={18} />
                          </button>
                      </div>
                  </div>
              </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
};
