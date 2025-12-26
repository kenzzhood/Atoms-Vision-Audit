import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, ShieldCheck, AlertTriangle, Eye, Crosshair, Wifi, Battery, Activity, Box, Zap, CameraOff } from 'lucide-react';

interface GlassCardProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

const springConfig = { type: "spring", stiffness: 350, damping: 25 };

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick, hover = true }) => (
  <motion.div
    initial={{ opacity: 0, y: 15, scale: 0.96 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={springConfig}
    whileHover={hover && onClick ? { y: -5, backgroundColor: 'rgba(255, 255, 255, 0.08)' } : {}}
    whileTap={onClick ? { scale: 0.98 } : {}}
    className={`bg-zinc-900/40 backdrop-blur-[40px] border border-white/10 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden group ${onClick ? 'cursor-pointer' : ''} ${className}`}
    onClick={onClick}
  >
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    <div className="absolute -inset-full pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-700">
      <motion.div 
        animate={{ rotate: [0, 360] }} 
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent blur-3xl"
      />
    </div>
    <div className="relative z-10">{children}</div>
  </motion.div>
);

export const NeonButton: React.FC<{
  children?: React.ReactNode;
  onClick: () => void;
  variant?: 'emerald' | 'blue' | 'red' | 'white' | 'ghost';
  disabled?: boolean;
  className?: string;
  loading?: boolean;
}> = ({ children, onClick, variant = 'blue', disabled = false, className = '', loading = false }) => {
  const themes = {
    blue: 'bg-blue-600 text-white shadow-[0_0_30px_-5px_rgba(37,99,235,0.6)]',
    emerald: 'bg-emerald-600 text-white shadow-[0_0_30px_-5px_rgba(16,185,129,0.6)]',
    red: 'bg-rose-600 text-white shadow-[0_0_30px_-5px_rgba(225,29,72,0.4)]',
    white: 'bg-white text-black font-black shadow-[0_15px_35px_-5px_rgba(255,255,255,0.3)]',
    ghost: 'bg-white/5 text-white border border-white/10 backdrop-blur-md hover:bg-white/10',
  };

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.01, y: -2 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      transition={springConfig}
      onClick={onClick}
      disabled={disabled || loading}
      className={`relative w-full h-14 rounded-2xl font-black text-[10px] tracking-[0.4em] uppercase overflow-hidden flex items-center justify-center gap-3 transition-all ${themes[variant]} ${disabled ? 'opacity-20 grayscale cursor-not-allowed' : 'active:brightness-125'} ${className}`}
    >
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <motion.div 
          animate={{ x: ['-200%', '200%'] }} 
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }} 
          className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12" 
        />
      </div>
      {loading ? (
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
      ) : children}
    </motion.button>
  );
};

export interface SmartCameraHandle {
  capture: () => string | null;
}

export const SmartCamera = forwardRef<SmartCameraHandle, { isActive: boolean; status?: 'neutral' | 'success' | 'error'; overlayText?: string }>(
  ({ isActive, status = 'neutral', overlayText }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    
    const requestCamera = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: 1280, height: 1280 } });
        if (videoRef.current) videoRef.current.srcObject = s;
        setHasPermission(true);
      } catch (err) {
        setHasPermission(false);
      }
    };

    useEffect(() => {
      requestCamera();
    }, []);

    useImperativeHandle(ref, () => ({
      capture: () => {
        const v = videoRef.current; const c = canvasRef.current;
        if (!v || !c || !hasPermission) return null;
        c.width = v.videoWidth; c.height = v.videoHeight;
        c.getContext('2d')?.drawImage(v, 0, 0);
        return c.toDataURL('image/jpeg', 0.8).split(',')[1];
      }
    }));

    return (
      <div className="relative w-full h-full bg-zinc-950 rounded-[2.5rem] overflow-hidden border border-white/10 group shadow-2xl">
        {hasPermission === false ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-zinc-900">
            <CameraOff className="w-12 h-12 text-zinc-700 mb-4" />
            <h3 className="text-white font-black text-xs uppercase tracking-widest mb-2">Camera Access Restricted</h3>
            <p className="text-zinc-500 text-[10px] mb-6">Permission denied. Please enable camera access in your browser settings to continue.</p>
            <button onClick={requestCamera} className="text-blue-500 text-[10px] font-black uppercase tracking-widest border border-blue-500/30 px-4 py-2 rounded-xl active:scale-95 transition-transform">Retry Access</button>
          </div>
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale-[0.2] contrast-[1.1]" />
        )}
        <canvas ref={canvasRef} className="hidden" />
        
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
            <div className="flex justify-between items-start opacity-70">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <Zap size={10} className="text-blue-400 animate-pulse" />
                        <span className="text-[8px] font-mono text-white tracking-widest uppercase">CORE-LINK_04</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-zinc-500">
                    <Wifi size={12} />
                    <Battery size={12} />
                </div>
            </div>

            <div className="relative flex-1 flex items-center justify-center">
                <div className="absolute w-full aspect-square max-w-[200px] border border-white/[0.03] rounded-full animate-spin-slow" />
                <AnimatePresence>
                  {overlayText && !isActive && status === 'neutral' && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
                      className="bg-black/80 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10 z-10"
                    >
                      <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">{overlayText}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="absolute inset-0 flex items-center justify-center opacity-5">
                  <Crosshair className="w-24 h-24" />
                </div>
                <div className="absolute inset-x-8 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent animate-scan-line" />
            </div>

            <div className="flex justify-between items-end opacity-70">
                <div className="text-[7px] font-mono text-zinc-500 leading-relaxed uppercase">
                    ATMOS_V: 2.0.1<br/>MODE: REALTIME
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[8px] font-black tracking-widest uppercase text-white">READY</span>
                </div>
            </div>
        </div>

        <AnimatePresence>
            {isActive && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 pointer-events-none z-20">
                    <motion.div 
                      initial={{ top: "-10%" }} animate={{ top: "110%" }} 
                      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} 
                      className="absolute left-0 right-0 h-1.5 bg-blue-400 shadow-[0_0_35px_5px_rgba(59,130,246,0.6)]" 
                    />
                    <div className="absolute inset-0 bg-blue-500/10 backdrop-brightness-125" />
                </motion.div>
            )}
        </AnimatePresence>

        <AnimatePresence>
            {status !== 'neutral' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} 
                  className={`absolute inset-0 flex flex-col items-center justify-center z-50 backdrop-blur-md ${status === 'success' ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}
                >
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center ${status === 'success' ? 'bg-emerald-500' : 'bg-rose-500'} relative`}>
                        <div className="absolute inset-0 rounded-full animate-ping opacity-20" />
                        {status === 'success' ? <ShieldCheck size={40} className="text-white" /> : <AlertTriangle size={40} className="text-white" />}
                    </div>
                    <div className="mt-4 font-black text-xl tracking-tighter uppercase text-white drop-shadow-xl">{status === 'success' ? 'Verified' : 'Flagged'}</div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    );
  }
);
SmartCamera.displayName = "SmartCamera";

export const VoiceVisualizer = ({ active }: { active: boolean }) => (
  <div className="h-16 flex items-center justify-center gap-1.5">
    {[...Array(16)].map((_, i) => (
      <motion.div
        key={i}
        animate={active ? { height: [8, 40, 12, 32, 8] } : { height: 4 }}
        transition={{ repeat: Infinity, duration: 0.6 + (i * 0.05), ease: "easeInOut" }}
        className={`w-1 rounded-full ${active ? 'bg-blue-400' : 'bg-zinc-800'}`}
      />
    ))}
  </div>
);
