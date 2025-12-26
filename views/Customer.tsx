import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Ticket, ChevronRight, Star, Loader2, Sparkles, ReceiptText, Hexagon, Fingerprint, ArrowRight } from 'lucide-react';
import { NeonButton, SmartCamera, SmartCameraHandle, GlassCard } from '../components/UI';
import { generateDynamicAd, analyzeImage } from '../utils/ai';
import { Type } from '@google/genai';

const springConfig = { type: "spring", stiffness: 350, damping: 30 };

export const CustomerView = () => {
  const [phase, setPhase] = useState<'scan' | 'processing' | 'ad' | 'result'>('scan');
  const [adData, setAdData] = useState<any>(null);
  const cameraRef = useRef<SmartCameraHandle>(null);

  const handleScan = async () => {
    setPhase('processing');
    await new Promise(r => setTimeout(r, 2000));
    const data = await generateDynamicAd();
    setAdData(data);
    setPhase('ad');
  };

  return (
    <div className="h-full w-full relative overflow-hidden bg-black/20 rounded-[2.5rem] border border-white/5">
      <AnimatePresence mode="wait">
        {/* Phase 1: Capture Phase */}
        {(phase === 'scan' || phase === 'processing') && (
          <motion.div
            key="scan-phase"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}
            className="absolute inset-0 flex flex-col p-5"
          >
             {/* Camera Section */}
             <div className="flex-1 relative overflow-hidden mb-5 rounded-3xl min-h-0">
                <SmartCamera 
                    ref={cameraRef}
                    isActive={phase === 'processing'} 
                    overlayText="ALIGN DELIVERY RECEIPT"
                />
             </div>
            
            {/* Redesigned 'Claim Subsidy' Section */}
            <div className="shrink-0 px-2 mb-8">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }} 
                  animate={{ y: 0, opacity: 1 }} 
                  transition={{ delay: 0.2 }}
                  className="relative group p-6 rounded-[2rem] bg-gradient-to-br from-zinc-900/80 to-black/80 border border-white/5 backdrop-blur-xl overflow-hidden shadow-2xl"
                >
                    {/* Decorative Background Element */}
                    <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-500/10 blur-3xl rounded-full" />
                    
                    <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-blue-400">
                          <Fingerprint size={24} className="animate-pulse" />
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tighter leading-none mb-2">
                          Claim Subsidy
                        </h2>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed max-w-[180px]">
                          Verify delivery signature to unlock enterprise rewards
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Action Button - Better spacing and padding for visibility */}
            <div className="shrink-0 pb-4">
                <NeonButton 
                    onClick={handleScan} 
                    variant="white" 
                    loading={phase === 'processing'}
                    className="h-16 rounded-[1.5rem] shadow-[0_10px_40px_-10px_rgba(255,255,255,0.4)]"
                >
                    {phase === 'processing' ? 'PROCESSING...' : 'CAPTURE & ANALYZE'}
                </NeonButton>
            </div>
          </motion.div>
        )}

        {/* Phase 2: Sponsored Ad Phase */}
        {phase === 'ad' && (
          <motion.div
            key="ad-phase"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 z-50 flex flex-col bg-black"
          >
            <div className="flex-1 relative overflow-hidden">
                <motion.img 
                    initial={{ scale: 1.3 }} animate={{ scale: 1 }} transition={{ duration: 5 }}
                    src={`https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=1200&q=90`} 
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                
                <div className="absolute bottom-12 left-0 right-0 p-10">
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex items-center gap-2 mb-4 bg-white/10 backdrop-blur-2xl w-fit px-3 py-1 rounded-full border border-white/10">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span className="text-[9px] text-white font-black tracking-widest uppercase">Sponsored Reward</span>
                    </motion.div>
                    
                    <motion.h3 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-5xl font-black text-white mb-3 tracking-tighter leading-none">
                        {adData?.brand || 'ORBIT BREW'}
                    </motion.h3>
                    <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-zinc-400 text-lg font-medium leading-tight opacity-90">
                        {adData?.headline || 'Synthetic perfection in every drop.'}
                    </motion.p>
                </div>
            </div>

            <div className="p-8 pb-14 bg-black border-t border-white/5">
                <NeonButton onClick={() => setPhase('result')} variant="blue" className="h-16">
                    Redeem Reward & Finish
                </NeonButton>
                <button onClick={() => setPhase('result')} className="w-full mt-6 text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">Skip to Receipt</button>
            </div>
          </motion.div>
        )}

        {/* Phase 3: Final Dashboard Phase */}
        {phase === 'result' && (
          <motion.div
            key="result-phase"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 z-[60] p-6 flex flex-col items-center justify-center bg-zinc-950"
          >
             <div className="w-full space-y-8">
                <div className="text-center">
                    <motion.div 
                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
                        className="w-20 h-20 bg-emerald-500 rounded-full mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.4)] mb-6"
                    >
                        <ShieldCheck className="w-10 h-10 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-1">Audit Passed</h2>
                    <p className="text-zinc-500 font-mono text-[9px] tracking-widest uppercase">Manifest #Verified</p>
                </div>

                <div className="bg-zinc-900/50 rounded-[2rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="space-y-5 relative z-10">
                        <div className="flex justify-between text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                            <span>Base Charge</span>
                            <span className="text-zinc-300">₹45.00</span>
                        </div>
                        <div className="flex justify-between text-[11px] font-black text-blue-400 uppercase tracking-widest">
                            <span>{adData?.brand || 'Partner'} Credit</span>
                            <span>-₹45.00</span>
                        </div>
                        <div className="h-px bg-white/5" />
                        <div className="flex justify-between items-end">
                            <span className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em]">Total Due</span>
                            <span className="text-5xl font-black text-emerald-400 tracking-tighter drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]">₹0</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-5 flex items-center gap-5 shadow-2xl">
                    <div className="bg-zinc-100 p-4 rounded-2xl shrink-0"><Ticket className="w-7 h-7 text-black" /></div>
                    <div className="flex-1 min-w-0">
                        <div className="text-black font-black text-[10px] uppercase tracking-widest">Reward Unlocked</div>
                        <div className="text-[10px] text-zinc-500 font-mono">CODE: ATMOS2025</div>
                    </div>
                    <button className="bg-black text-white px-4 py-2.5 rounded-xl text-[9px] font-black uppercase">Apply</button>
                </div>

                <NeonButton onClick={() => setPhase('scan')} variant="ghost" className="mt-4 rounded-2xl">
                    Exit Terminal
                </NeonButton>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
