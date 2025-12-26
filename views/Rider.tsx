import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, MapPin, Package, AlertTriangle, Scan, Zap } from 'lucide-react';
import { GlassCard, NeonButton, SmartCamera, SmartCameraHandle } from '../components/UI';
import { analyzeImage } from '../utils/ai';
import { Type } from '@google/genai';
import { DigitalLabel } from '../components/DigitalLabel';

export const RiderView = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [dropoffStatus, setDropoffStatus] = useState<'idle' | 'scanning' | 'damaged' | 'safe'>('idle');
  const cameraRef = useRef<SmartCameraHandle>(null);

  const handleScan = async () => {
    setDropoffStatus('scanning');
    // Simulate scanning delay
    await new Promise(r => setTimeout(r, 2000));
    setDropoffStatus('safe');
    setStep(2);
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">AdSure Agent</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></span>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Live Logistics Stream</p>
          </div>
        </div>
        <div className="bg-zinc-900 px-4 py-2 rounded-2xl border border-zinc-800 text-xs font-mono text-zinc-400">
          UNIT-992
        </div>
      </div>

      <div className="flex-1 space-y-4">
        {/* Timeline Step 1: Scanning */}
        <GlassCard className={`relative overflow-hidden ${step === 1 ? 'border-emerald-500/40 shadow-neon-emerald' : 'opacity-40 grayscale scale-[0.98]'}`} hover={step === 1}>
          <div className="flex items-start gap-4 mb-6">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${step === 1 ? 'bg-emerald-600 text-white shadow-lg' : 'bg-zinc-800 text-zinc-500'}`}>
              <Scan size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-white tracking-tight">Package Scan</h3>
              <p className="text-zinc-500 text-xs mt-0.5">Identify parcel context</p>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div className="relative h-64 bg-black/40 rounded-2xl border border-zinc-800 overflow-hidden group">
                {/* AR Overlay Simulation */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                  <div className="w-48 h-48 border-2 border-emerald-500/50 rounded-lg relative">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400 -mt-1 -ml-1" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400 -mt-1 -mr-1" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400 -mb-1 -ml-1" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400 -mb-1 -mr-1" />

                    {dropoffStatus === 'scanning' && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "100%" }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-full bg-emerald-500/20 shadow-[0_0_20px_#10b981]"
                      />
                    )}
                  </div>
                </div>

                <SmartCamera
                  ref={cameraRef}
                  isActive={dropoffStatus === 'scanning'}
                  status={dropoffStatus === 'scanning' ? 'success' : 'neutral'}
                  className="h-full"
                />
              </div>

              <NeonButton
                variant={dropoffStatus === 'scanning' ? 'blue' : 'emerald'}
                onClick={handleScan}
                disabled={dropoffStatus === 'scanning'}
              >
                {dropoffStatus === 'scanning' ? 'Analyzing Context...' : 'Scan Smart Label'}
              </NeonButton>
            </div>
          )}
        </GlassCard>

        {/* Timeline Step 2: Dynamic Label */}
        <GlassCard className={`relative ${step === 2 ? 'border-blue-500/40 shadow-neon-blue' : 'opacity-40 grayscale scale-[0.98]'}`}>
          <div className="flex items-start gap-4 mb-6">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${step === 2 ? 'bg-blue-500' : 'bg-zinc-800'} text-white transition-colors`}>
              <Zap size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-white tracking-tight">Active Strategy</h3>
              <p className="text-zinc-500 text-xs mt-0.5">Real-time content injection</p>
            </div>
          </div>

          {step === 2 && (
            <div className="space-y-4">
              <DigitalLabel />
              <NeonButton onClick={() => setStep(1)} variant="white" className="mt-4">
                Scan Next Package
              </NeonButton>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};
