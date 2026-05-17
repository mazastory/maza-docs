/**
 * 🏥 MazaStudio Health Dashboard
 * AGENTS.md: Observability (O-01) - Real-time monitoring
 */

import { useState, useEffect } from "react";
import { Activity, Zap, ShieldAlert, BarChart3, Clock, RefreshCcw, Database, HardDrive } from "lucide-react";
import { motion } from "framer-motion";
import { fetchApi } from "../lib/api";

export default function HealthDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetchApi("/api/health/stats");
      const result = await res.json();
      if (result.success) setStats(result.data);
    } catch (e) {
      console.error("Failed to fetch health stats", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000); // 10초마다 갱신
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) return <div className="p-8 text-center text-slate-400">시스템 모니터링 로딩 중...</div>;

  const { queues = {}, db = {}, system = {} } = stats || {};

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter text-slate-900">Health Dashboard</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Maza Autopilot OS 실시간 관제 센터</p>
        </div>
        <button 
          onClick={fetchStats}
          className="p-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm"
        >
          <RefreshCcw size={18} className={loading ? "animate-spin text-indigo-600" : "text-slate-400"} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* DB Success Rate Card */}
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
              <Zap size={20} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">24h Success Rate</span>
          </div>
          <div className="flex items-end gap-2">
            <div className="text-4xl font-black italic text-emerald-600">
              {db.total24h > 0 ? Math.round((db.success24h / db.total24h) * 100) : 0}%
            </div>
            <div className="text-[10px] font-bold text-slate-400 pb-2 uppercase tracking-widest">Efficiency</div>
          </div>
        </div>

        {/* Failure Rate Card */}
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
              <ShieldAlert size={20} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">24h Failure Rate</span>
          </div>
          <div className="flex items-end gap-2">
            <div className="text-4xl font-black italic text-red-600">
              {db.total24h > 0 ? Math.round((db.failed24h / db.total24h) * 100) : 0}%
            </div>
            <div className="text-[10px] font-bold text-slate-400 pb-2 uppercase tracking-widest">At Risk</div>
          </div>
        </div>

        {/* Memory Card */}
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
              <HardDrive size={20} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Memory Usage</span>
          </div>
          <div className="flex items-end gap-2">
            <div className="text-4xl font-black italic text-indigo-600">
              {Math.round(system.memory?.rss / 1024 / 1024) || 0}
            </div>
            <div className="text-[10px] font-bold text-slate-400 pb-2 uppercase tracking-widest">MB RSS</div>
          </div>
        </div>

        {/* Uptime Card */}
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500">
              <Clock size={20} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">System Uptime</span>
          </div>
          <div className="flex items-end gap-2">
            <div className="text-4xl font-black italic text-slate-900">
              {Math.floor(system.uptime / 3600) || 0}h
            </div>
            <div className="text-[10px] font-bold text-slate-400 pb-2 uppercase tracking-widest">Online</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Queue Metrics */}
        <div className="bg-slate-900 rounded-[40px] p-10 text-white space-y-8 border border-slate-800 shadow-2xl">
          <div className="flex items-center gap-3">
            <Activity size={24} className="text-indigo-400" />
            <h3 className="text-2xl font-black italic tracking-tight">Queue Real-time Pipeline</h3>
          </div>
          
          <div className="space-y-6">
            {Object.entries(queues).map(([name, counts]: [string, any]) => (
              <div key={name} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-black uppercase tracking-[0.2em] text-indigo-300">{name.toUpperCase()} ENGINE</span>
                  <span className="text-[10px] font-bold text-slate-500">
                    Active: {counts.active} | Wait: {counts.wait} | Failed: {counts.failed}
                  </span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="h-full bg-indigo-500" style={{ width: `${(counts.active / (counts.active + counts.wait + counts.failed || 1)) * 100}%` }} />
                  <div className="h-full bg-red-500" style={{ width: `${(counts.failed / (counts.active + counts.wait + counts.failed || 1)) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Database Insights */}
        <div className="bg-white border border-slate-100 rounded-[40px] p-10 space-y-8 shadow-sm">
          <div className="flex items-center gap-3">
            <Database size={24} className="text-indigo-600" />
            <h3 className="text-2xl font-black italic tracking-tight">Database Insights</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Tasks (24h)</div>
              <div className="text-3xl font-black italic">{db.total24h}</div>
            </div>
            <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
              <div className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-2">Retries (24h)</div>
              <div className="text-3xl font-black italic text-amber-700">{db.retry24h}</div>
            </div>
          </div>

          <div className="p-6 bg-indigo-600 rounded-3xl text-white">
            <div className="flex items-center gap-4">
              <BarChart3 size={32} />
              <div>
                <h4 className="text-lg font-black italic">Publishing Velocity</h4>
                <p className="text-xs font-medium text-indigo-100">지난 24시간 동안 평균 {Math.round(db.total24h / 24 * 10) / 10}건/시간 발행 처리 중입니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
