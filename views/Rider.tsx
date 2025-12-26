import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Check, MapPin, Package, AlertTriangle, ChevronRight } from 'lucide-react';
import { GlassCard, NeonButton, SmartCamera, SmartCameraHandle, VoiceVisualizer } from '../components/UI';
import { verifyVoiceCommand, analyzeImage } from '../utils/ai';
import { Type } from '@google/genai';

export const RiderView = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [dropoffStatus, setDropoffStatus] = useState<'idle' | 'scanning' | 'damaged' | 'safe'>('idle');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const cameraRef = useRef<SmartCameraHandle>(null);

  const handleVoiceVerify = async () => {
    if (isListening) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      chunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
      mediaRecorderRef.current.onstop = async () => {
        setIsListening(false);
        const blob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
            const base64data = (reader.result as string).split(',')[1];
            setTranscript('Processing...');
            const result = await verifyVoiceCommand(base64data);
            setTranscript(result.transcript || "...");
            if (result.verified) setTimeout(() => setStep(2), 1500);
        };
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorderRef.current.start();
      setIsListening(true);
      setTranscript('');
      setTimeout(() => mediaRecorderRef.current?.stop(), 3000);
    } catch (err) {
      setTranscript("Mic error.");
    }
  };

  const handleDropoffScan = async () => {
    setDropoffStatus('scanning');
    await new Promise(r => setTimeout(r, 2000));
    const image = cameraRef.current?.capture();
    if (image) {
        const analysis = await analyzeImage(
            image,
            "Check for package damage. Return JSON: { damaged: boolean, reason: string }",
            { type: Type.OBJECT, properties: { damaged: { type: Type.BOOLEAN }, reason: { type: Type.STRING } } }
        );
        setDropoffStatus(analysis?.damaged ? 'damaged' : 'safe');
    } else {
        setDropoffStatus('safe');
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
       <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Active Duty</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]"></span>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Batch #8821-X</p>
              </div>
            </div>
            <div className="bg-zinc-900 px-4 py-2 rounded-2xl border border-zinc-800 text-xs font-mono text-zinc-400">
              IND-BLR-04
            </div>
      </div>

      <div className="flex-1 space-y-4">
          {/* Timeline Step 1 */}
          <GlassCard className={`relative overflow-hidden ${step === 1 ? 'border-blue-500/40 shadow-neon-blue' : 'opacity-40 grayscale scale-[0.98]'}`} hover={step === 1}>
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${step > 1 ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white shadow-lg'}`}>
                  {step > 1 ? <Check size={20} /> : <Package size={20} />}
                </div>
                <div>
                  <h3 className="text-base font-black text-white tracking-tight">Vendor Handover</h3>
                  <p className="text-zinc-500 text-xs mt-0.5">Voice-authenticated seal verification</p>
                </div>
              </div>
              
              {step === 1 && (
                <div className="space-y-4">
                    <div className="bg-black/40 rounded-2xl p-6 flex flex-col items-center justify-center border border-zinc-800 shadow-inner">
                        <VoiceVisualizer active={isListening} />
                        <div className="mt-4 text-center">
                           {isListening ? (
                               <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Listening for command...</p>
                           ) : transcript ? (
                                <p className="text-emerald-400 font-bold italic">"{transcript}"</p>
                            ) : (
                                <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest">Say "Verify Pickup"</p>
                            )}
                        </div>
                    </div>
                    <NeonButton 
                        variant={isListening ? 'red' : 'blue'} 
                        onClick={handleVoiceVerify} 
                        disabled={isListening}
                    >
                        {isListening ? 'Awaiting Audio...' : 'Authenticate Seal'}
                    </NeonButton>
                </div>
              )}
          </GlassCard>

          {/* Timeline Step 2 */}
          <GlassCard className={`relative ${step === 2 ? 'border-emerald-500/40 shadow-neon-emerald' : 'opacity-40 grayscale scale-[0.98]'}`}>
               <div className="flex items-start gap-4 mb-6">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${dropoffStatus === 'safe' ? 'bg-emerald-500' : 'bg-zinc-800'} text-white transition-colors`}>
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-white tracking-tight">Final Handoff</h3>
                  <p className="text-zinc-500 text-xs mt-0.5">Automated structural integrity scan</p>
                </div>
              </div>

              {step === 2 && (
                  <div className="space-y-4">
                       {dropoffStatus === 'idle' ? (
                           <NeonButton onClick={handleDropoffScan} variant="white">
                               Start Dropoff Scan
                           </NeonButton>
                       ) : (
                           <div className="space-y-4">
                               <SmartCamera 
                                    ref={cameraRef}
                                    isActive={dropoffStatus === 'scanning'} 
                                    status={dropoffStatus === 'damaged' ? 'error' : dropoffStatus === 'safe' ? 'success' : 'neutral'} 
                                />
                               
                               <AnimatePresence>
                               {dropoffStatus === 'damaged' && (
                                   <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-center gap-4">
                                       <AlertTriangle className="w-6 h-6 shrink-0" />
                                       <div className="text-xs font-bold uppercase tracking-tight">Damage Detected. Incident log created.</div>
                                   </motion.div>
                               )}
                               </AnimatePresence>
                           </div>
                       )}
                  </div>
              )}
          </GlassCard>
      </div>
    </div>
  );
};