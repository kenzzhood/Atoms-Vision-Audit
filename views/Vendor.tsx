import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Hash, FileKey, Terminal, PackageSearch, Layers, Command } from 'lucide-react';
import { GlassCard, NeonButton, SmartCamera } from '../components/UI';
import { ScanState } from '../types';
import { generateScanLogs, analyzeImage } from '../utils/ai';
import { Type } from '@google/genai';

export const VendorView = () => {
  const [orderId, setOrderId] = useState('REF-8842-X');
  const [scanState, setScanState] = useState<ScanState>(ScanState.IDLE);
  const [logs, setLogs] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<{description: string, hash: string} | null>(null);
  const cameraRef = useRef<{ capture: () => string | null }>(null);

  const startScan = async () => {
    setScanState(ScanState.SCANNING);
    setLogs(['ACCESSING VISION CORE...', 'SYNCING SENSORS...']);
    
    await new Promise(r => setTimeout(r, 1800));
    const img = cameraRef.current?.capture();
    
    if (img) {
        setLogs(prev => [...prev, 'FRAME CAPTURED. ANALYZING...']);
        const result = await analyzeImage(img, "Identify logistics item. JSON: { desc: string }", {
            type: Type.OBJECT, properties: { desc: { type: Type.STRING } }
        });
        
        const aiLogs = await generateScanLogs(orderId, result?.desc);
        aiLogs.forEach((l, i) => setTimeout(() => setLogs(p => [...p, l]), i * 300));
        
        setTimeout(() => {
            setAnalysis({ 
                description: result?.desc || "Cargo Load Prototype", 
                hash: `ATMOS_SIG: ${Math.random().toString(36).substring(2, 12).toUpperCase()}` 
            });
            setScanState(ScanState.COMPLETE);
        }, aiLogs.length * 300 + 400);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-full gap-4">
      {/* Header - Shrinks only if needed */}
      <div className="shrink-0 space-y-2">
        <div className="flex items-center gap-2 text-blue-400/80">
            <Layers size={14} />
            <span className="text-[9px] font-black uppercase tracking-[0.3em]">Pending Manifests</span>
        </div>
        <div className="relative">
            <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-5 text-lg font-mono text-white focus:border-blue-500/50 outline-none transition-all shadow-inner placeholder:text-zinc-700"
                placeholder="MANIFEST_ID"
            />
            <Command className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
        </div>
      </div>

      {/* Main Camera Container - Grows to fill space */}
      <div className="flex-1 relative min-h-0 overflow-hidden rounded-[2.5rem]">
        <SmartCamera
          ref={cameraRef}
          isActive={scanState === ScanState.SCANNING}
          status={scanState === ScanState.COMPLETE ? 'success' : 'neutral'}
          overlayText="READY FOR AUDIT"
        />
        
        <AnimatePresence>
            {scanState === ScanState.SCANNING && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-x-6 top-6 z-40 bg-black/80 backdrop-blur-2xl rounded-2xl border border-white/10 p-4 shadow-2xl">
                    <div className="flex items-center gap-2 mb-2">
                        <Terminal size={10} className="text-blue-400" />
                        <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Vision Logic Feedback</span>
                    </div>
                    <div className="font-mono text-[8px] text-blue-300 space-y-1">
                        {logs.slice(-2).map((l, i) => <div key={i} className="flex gap-2"><span className="opacity-30">#</span>{l}</div>)}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* Footer / Results Area - Always visible at the bottom */}
      <div className="shrink-0 space-y-4 pb-2">
        <AnimatePresence mode="wait">
          {scanState === ScanState.COMPLETE && analysis ? (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} key="result">
                  <GlassCard className="border-emerald-500/30 bg-emerald-500/5 py-4 px-6 rounded-3xl">
                      <div className="flex items-center justify-between mb-1">
                          <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">Verified Target</span>
                          <ShieldCheck size={14} className="text-emerald-500" />
                      </div>
                      <div className="text-sm font-black text-white truncate">{analysis.description.toUpperCase()}</div>
                  </GlassCard>
              </motion.div>
          ) : null}
        </AnimatePresence>

        <NeonButton 
            onClick={startScan} 
            variant={scanState === ScanState.COMPLETE ? 'ghost' : 'blue'}
            loading={scanState === ScanState.SCANNING}
        >
            {scanState === ScanState.COMPLETE ? 'Verify Another' : 'Initiate Smart Scan'}
        </NeonButton>
      </div>
    </div>
  );
};
