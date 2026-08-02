/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ChangeEvent } from 'react';
import { motion } from 'motion/react';
import { DollarSign, ArrowRightLeft, ArrowDownUp } from 'lucide-react';

export default function App() {
  const [rateInput, setRateInput] = useState<string>('154,000');
  const [usdInput, setUsdInput] = useState<string>('');
  const [iqdInput, setIqdInput] = useState<string>('');
  const [lastEdited, setLastEdited] = useState<'USD' | 'IQD'>('USD');

  const cleanNum = (val: string) => val.replace(/,/g, '');

  const formatNum = (val: string) => {
    let cleaned = cleanNum(val);
    if (cleaned === '') return '';
    if (cleaned === '.') return '0.';
    
    const parts = cleaned.split('.');
    if (parts[0].length > 1 && parts[0].startsWith('0')) {
      parts[0] = parseInt(parts[0], 10).toString();
    }
    
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.slice(0, 2).join('.');
  };

  const handleRateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const cleaned = cleanNum(val);
    if (val === '' || /^\d*\.?\d*$/.test(cleaned)) {
      const formatted = formatNum(val);
      setRateInput(formatted);
      
      const rate = parseFloat(cleaned) / 100;
      if (isNaN(rate) || rate <= 0) return;

      if (lastEdited === 'USD') {
        const usd = parseFloat(cleanNum(usdInput));
        if (!isNaN(usd)) {
          const calculatedIqd = usd * rate;
          const iqdStr = parseFloat(calculatedIqd.toFixed(2)).toString();
          setIqdInput(formatNum(iqdStr));
        } else {
          setIqdInput('');
        }
      } else {
        const iqd = parseFloat(cleanNum(iqdInput));
        if (!isNaN(iqd)) {
          const calculatedUsd = iqd / rate;
          const usdStr = parseFloat(calculatedUsd.toFixed(2)).toString();
          setUsdInput(formatNum(usdStr));
        } else {
          setUsdInput('');
        }
      }
    }
  };

  const handleUsdChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const cleaned = cleanNum(val);
    if (val === '' || /^\d*\.?\d*$/.test(cleaned)) {
      const formatted = formatNum(val);
      setUsdInput(formatted);
      setLastEdited('USD');
      
      const usd = parseFloat(cleaned);
      const rate = parseFloat(cleanNum(rateInput)) / 100;
      
      if (!isNaN(usd) && !isNaN(rate) && rate > 0) {
        const calculatedIqd = usd * rate;
        const iqdStr = parseFloat(calculatedIqd.toFixed(2)).toString();
        setIqdInput(formatNum(iqdStr));
      } else {
        setIqdInput('');
      }
    }
  };

  const handleIqdChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const cleaned = cleanNum(val);
    if (val === '' || /^\d*\.?\d*$/.test(cleaned)) {
      const formatted = formatNum(val);
      setIqdInput(formatted);
      setLastEdited('IQD');
      
      const iqd = parseFloat(cleaned);
      const rate = parseFloat(cleanNum(rateInput)) / 100;
      
      if (!isNaN(iqd) && !isNaN(rate) && rate > 0) {
        const calculatedUsd = iqd / rate;
        const usdStr = parseFloat(calculatedUsd.toFixed(2)).toString();
        setUsdInput(formatNum(usdStr));
      } else {
        setUsdInput('');
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans text-zinc-100 overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Glowing Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-amber-500/10 rounded-full blur-[100px]" />
        
        {/* Large Faint Symbols */}
        <div className="absolute top-[10%] left-[5%] text-[15rem] md:text-[25rem] font-black text-emerald-500/5 -rotate-12 select-none leading-none">
          $
        </div>
        <div className="absolute bottom-[5%] right-[5%] text-[15rem] md:text-[25rem] font-black text-amber-500/5 rotate-12 select-none leading-none">
          د.ع
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-zinc-900/60 backdrop-blur-2xl rounded-[2rem] p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.3)] border border-white/10"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">
            Converter
          </h1>
          <div className="p-2.5 bg-zinc-800/50 rounded-2xl border border-white/5 shadow-inner">
            <ArrowRightLeft className="w-5 h-5 text-zinc-400" />
          </div>
        </div>

        <div className="space-y-6">
          {/* Editable Rate Display */}
          <div className="space-y-2">
            <label className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Exchange Rate</label>
            <div className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl p-3 sm:p-4 flex items-center justify-between transition-all focus-within:border-white/20 focus-within:bg-zinc-900/80 shadow-inner">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-zinc-200 font-semibold text-sm sm:text-base">100</span>
              </div>
              
              <ArrowRightLeft className="w-4 h-4 text-zinc-600 mx-1 sm:mx-2 flex-shrink-0" />
              
              <div className="flex items-center space-x-2 sm:space-x-3">
                <input
                  type="text"
                  inputMode="decimal"
                  value={rateInput}
                  onChange={handleRateChange}
                  className="w-20 sm:w-28 bg-zinc-950/50 border border-white/5 rounded-xl py-1.5 px-2 sm:px-3 text-right font-bold text-amber-400 outline-none transition-all focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 text-sm sm:text-base"
                />
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/20 flex-shrink-0">
                  <span className="text-amber-400 font-bold text-xs">د.ع</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col relative pt-4">
            {/* USD Input */}
            <div className="space-y-2">
              <label className="text-[10px] sm:text-xs font-bold text-emerald-500/80 uppercase tracking-widest ml-1">USD Amount</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center group-focus-within:bg-emerald-500/20 transition-colors border border-emerald-500/10 group-focus-within:border-emerald-500/30">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>
                <input
                  type="text"
                  inputMode="decimal"
                  value={usdInput}
                  onChange={handleUsdChange}
                  placeholder="0"
                  className="w-full bg-zinc-950/50 border border-white/5 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 focus:bg-zinc-900/80 rounded-2xl py-4 sm:py-5 pl-14 sm:pl-16 pr-12 sm:pr-16 text-2xl sm:text-3xl font-semibold text-zinc-100 placeholder:text-zinc-700 outline-none transition-all shadow-inner"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="text-zinc-600 font-bold text-xs sm:text-sm">USD</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center -my-4 relative z-10">
              <div className="bg-zinc-800 p-2.5 rounded-full border border-white/10 shadow-xl text-zinc-400">
                <ArrowDownUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>

            {/* IQD Input */}
            <div className="space-y-2">
              <label className="text-[10px] sm:text-xs font-bold text-amber-500/80 uppercase tracking-widest ml-1">IQD Amount</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center group-focus-within:bg-amber-500/20 transition-colors border border-amber-500/10 group-focus-within:border-amber-500/30">
                    <span className="text-amber-500 font-bold text-xs sm:text-sm">د.ع</span>
                  </div>
                </div>
                <input
                  type="text"
                  inputMode="decimal"
                  value={iqdInput}
                  onChange={handleIqdChange}
                  placeholder="0"
                  className="w-full bg-zinc-950/50 border border-white/5 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:bg-zinc-900/80 rounded-2xl py-4 sm:py-5 pl-14 sm:pl-16 pr-12 sm:pr-16 text-2xl sm:text-3xl font-semibold text-zinc-100 placeholder:text-zinc-700 outline-none transition-all shadow-inner"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="text-zinc-600 font-bold text-xs sm:text-sm">IQD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
