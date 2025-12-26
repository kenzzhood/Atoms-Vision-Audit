import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAdStrategy } from '../utils/api';
import { Sparkles, CloudRain, Coffee, Car } from 'lucide-react';

export const DigitalLabel = () => {
    const [adData, setAdData] = useState<{ ad_strategy: string, raw_data: string } | null>(null);

    useEffect(() => {
        const poll = setInterval(async () => {
            const data = await fetchAdStrategy();
            if (data && (!adData || data.ad_strategy !== adData.ad_strategy)) {
                setAdData(data);
                // Trigger detail notification/toast here if needed
            }
        }, 2000); // Poll every 2 seconds

        return () => clearInterval(poll);
    }, [adData]);

    const getIcon = (text: string) => {
        if (!text) return <Sparkles />;
        if (text.toLowerCase().includes("rain")) return <CloudRain className="text-blue-400" />;
        if (text.toLowerCase().includes("coffee")) return <Coffee className="text-amber-500" />;
        if (text.toLowerCase().includes("traffic")) return <Car className="text-red-400" />;
        return <Sparkles className="text-yellow-400" />;
    };

    return (
        <div className="w-full bg-black/80 border border-zinc-800 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-50 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Smart Label ID-8X</span>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-xs text-emerald-500 font-mono">LIVE SYNC</span>
                        </div>
                    </div>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="opacity-50"
                    >
                        <Sparkles size={16} className="text-zinc-600" />
                    </motion.div>
                </div>

                <AnimatePresence mode="wait">
                    {adData ? (
                        <motion.div
                            key={adData.ad_strategy}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-zinc-900/80 rounded-2xl p-4 border border-zinc-700/50 backdrop-blur-md"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-zinc-800 rounded-xl">
                                    {getIcon(adData.raw_data)}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-lg font-black text-white leading-tight italic">
                                        "{adData.ad_strategy}"
                                    </h2>
                                    <p className="text-[10px] text-zinc-400 mt-1 font-mono truncate">
                                        Context: {adData.raw_data}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="h-24 flex items-center justify-center text-zinc-600 font-mono text-xs animate-pulse">
                            Waiting for stream...
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Holographic effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-100%] group-hover:animate-shine pointer-events-none" />
        </div>
    );
};
