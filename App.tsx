import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Store, User, BarChart3, ChevronLeft, Command, Settings, Bell, Hexagon } from 'lucide-react';
import { VendorView } from './views/Vendor';
import { RiderView } from './views/Rider';
import { CustomerView } from './views/Customer';
import { AdminView } from './views/Admin';
import { UserRole } from './types';

const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.NONE);

  const roles = [
    { id: UserRole.VENDOR, label: 'Vendor', icon: Store, desc: 'Manifest Auth', color: 'from-blue-600' },
    { id: UserRole.RIDER, label: 'Rider', icon: Truck, desc: 'Logistics Chain', color: 'from-emerald-600' },
    { id: UserRole.CUSTOMER, label: 'Customer', icon: User, desc: 'Audit Rewards', color: 'from-fuchsia-600' },
    { id: UserRole.ADMIN, label: 'Admin', icon: BarChart3, desc: 'Network Core', color: 'from-amber-600' },
  ];

  return (
    <div className="h-[100dvh] w-full bg-zinc-950 font-sans flex flex-col overflow-hidden relative selection:bg-blue-500/30">
      {/* Visual background layers */}
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-40" />
      
      <header className="h-20 px-8 flex items-center justify-between z-50 shrink-0 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <AnimatePresence mode="wait">
            {currentRole !== UserRole.NONE ? (
               <motion.button 
                 key="back" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                 onClick={() => setCurrentRole(UserRole.NONE)}
                 className="p-3 bg-white/5 rounded-2xl border border-white/10 active:scale-95 transition-transform"
               >
                 <ChevronLeft size={20} className="text-white" />
               </motion.button>
            ) : (
              <motion.div key="logo" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black shadow-2xl">
                        <Hexagon size={24} fill="currentColor" />
                   </div>
                   <div className="flex flex-col">
                        <span className="text-xl font-black tracking-tighter leading-none">ATMOS</span>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Vision-Audit Protocol</span>
                   </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex items-center gap-3">
            <button className="p-3 rounded-2xl bg-white/5 border border-white/10 text-zinc-500 hover:text-white transition-colors"><Bell size={18} /></button>
            <div className="w-10 h-10 rounded-full border border-white/10 bg-gradient-to-br from-zinc-700 to-zinc-900 overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Atmos" className="w-full h-full object-cover" />
            </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto relative z-10">
        <AnimatePresence mode="wait">
          {currentRole === UserRole.NONE ? (
            <motion.div 
              key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="p-8 h-full flex flex-col justify-center max-w-lg mx-auto"
            >
              <div className="mb-12 text-center">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                    <h2 className="text-5xl font-black tracking-tighter leading-[0.9] text-white">UP-LINK<br/>PORTAL</h2>
                    <p className="text-zinc-500 font-mono text-xs mt-6 uppercase tracking-[0.3em]">Authorized Personnel Only</p>
                </motion.div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {roles.map((role, i) => (
                  <motion.button
                    key={role.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentRole(role.id)}
                    className="group relative h-48 bg-white/5 border border-white/10 rounded-[2.5rem] p-6 text-left overflow-hidden hover:bg-white/10 transition-all shadow-2xl"
                  >
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${role.color} to-transparent opacity-20 group-hover:opacity-40 transition-opacity blur-2xl`} />
                    <role.icon className="w-8 h-8 text-white mb-4" />
                    <div className="mt-auto">
                        <h3 className="font-black text-xl text-white leading-tight">{role.label}</h3>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{role.desc}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="h-full w-full p-6 max-w-lg mx-auto"
            >
              {currentRole === UserRole.VENDOR && <VendorView />}
              {currentRole === UserRole.RIDER && <RiderView />}
              {currentRole === UserRole.CUSTOMER && <CustomerView />}
              {currentRole === UserRole.ADMIN && <AdminView />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;