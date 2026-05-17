import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Activity, 
  AlertCircle, 
  RotateCcw, 
  Clock, 
  ChevronRight,
  Code,
  Layout,
  Terminal,
  ShieldCheck
} from 'lucide-react';
import { cn } from '../lib/utils';

interface ReplayViewerProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

export const ReplayViewer = ({ isOpen, onClose, data }: ReplayViewerProps) => {
  if (!isOpen || !data) return null;

  const events = data.events || [];
  const startTime = data.startTime;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white">
                  <Terminal size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight italic">미션 복기 리포트</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mission ID: {data.jobId}</p>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all hover:rotate-90"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-hidden flex">
            {/* Sidebar: Summary */}
            <div className="w-72 border-r border-slate-100 bg-slate-50/30 p-8 space-y-8 overflow-y-auto">
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">상태 요약</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-500">결과</span>
                    <span className={cn(
                      "px-2 py-1 rounded-lg text-[10px] font-black uppercase",
                      data.error ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
                    )}>
                      {data.error ? "실패" : "성공"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-500">총 소요 시간</span>
                    <span className="text-sm font-black text-slate-900">
                      {data.endTime ? `${((data.endTime - startTime) / 1000).toFixed(1)}초` : '진행 중'}
                    </span>
                  </div>
                </div>
              </div>

              {data.error && (
                <div>
                  <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-4">에러 원인</h4>
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-[11px] font-bold text-rose-600 leading-relaxed">
                    {data.error}
                  </div>
                </div>
              )}

              {data.snapshot && (
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">마지막 스냅샷 (HTML)</h4>
                  <button 
                    onClick={() => {
                      const win = window.open();
                      win?.document.write(data.snapshot);
                    }}
                    className="w-full py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Layout size={14} /> 브라우저 뷰어 열기
                  </button>
                </div>
              )}
            </div>

            {/* Main Content: Event Timeline */}
            <div className="flex-1 overflow-y-auto p-8 bg-white custom-scrollbar">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">타임라인 이벤트 ({events.length})</h4>
              
              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-100" />

                <div className="space-y-6">
                  {events.map((event: any, i: number) => (
                    <div key={i} className="relative pl-12">
                      {/* Icon */}
                      <div className={cn(
                        "absolute left-0 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-sm z-10",
                        event.type === 'TRANSITION' ? "bg-indigo-600 text-white" : 
                        event.type === 'ERROR' ? "bg-rose-600 text-white" :
                        "bg-slate-100 text-slate-500"
                      )}>
                        {event.type === 'TRANSITION' ? <ChevronRight size={14} /> : 
                         event.type === 'ERROR' ? <AlertCircle size={14} /> : 
                         <Activity size={14} />}
                      </div>

                      <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-5 hover:bg-white hover:shadow-lg transition-all group">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {event.type} @ {((event.timestamp - startTime) / 1000).toFixed(2)}s
                          </span>
                          {event.meta?.tabId && (
                            <span className="text-[9px] font-bold text-slate-400 italic">Tab ID: {event.meta.tabId}</span>
                          )}
                        </div>

                        <div className="text-sm font-black text-slate-800">
                          {event.type === 'TRANSITION' ? (
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400">{event.from}</span>
                              <ChevronRight size={12} className="text-slate-300" />
                              <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-4">{event.to}</span>
                            </div>
                          ) : event.message || event.action}
                        </div>

                        {event.meta && Object.keys(event.meta).length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-100/50">
                            <pre className="text-[10px] text-slate-500 font-mono overflow-x-auto bg-white/50 p-3 rounded-xl">
                              {JSON.stringify(event.meta, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-emerald-400" size={16} />
              <span className="text-xs font-bold text-slate-400 italic">Deterministic Replay Engine v4.1</span>
            </div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Generated by Maza Autopilot OS
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
