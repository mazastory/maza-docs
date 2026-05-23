import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface AccordionItem {
  q: string;
  a: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export function Accordion({ items, className = '' }: AccordionProps) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item, i) => (
        <div key={i} className="group">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className={`w-full px-6 py-5 bg-white border rounded-2xl flex items-center justify-between text-left transition-all ${
              open === i
                ? 'border-indigo-600 shadow-lg ring-4 ring-indigo-50'
                : 'border-slate-100 hover:border-slate-200 shadow-sm'
            }`}
          >
            <span className="font-bold text-slate-800 text-sm leading-snug pr-4">{item.q}</span>
            <ChevronRight
              size={16}
              className={`shrink-0 text-slate-300 transition-transform duration-300 ${
                open === i ? 'rotate-90 text-indigo-600' : ''
              }`}
            />
          </button>
          {open === i && (
            <div className="px-6 pt-4 pb-6 animate-in fade-in slide-in-from-top-2 duration-200">
              <p className="text-slate-500 text-sm leading-relaxed pl-3 border-l-2 border-indigo-100">
                {item.a}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

interface StepCardProps {
  number: string | number;
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string;
}

export function StepCard({ number, title, description, action, icon, badge }: StepCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4 group hover:border-indigo-200 hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center font-black text-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
          {number}
        </div>
        {badge && (
          <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-lg border border-indigo-100">
            {badge}
          </span>
        )}
        {icon && <div className="text-slate-300 group-hover:text-indigo-400 transition-colors">{icon}</div>}
      </div>
      <div>
        <div className="font-black text-sm text-slate-900 uppercase italic tracking-tight mb-1">{title}</div>
        <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{description}</p>
      </div>
      {action && <div className="mt-auto">{action}</div>}
    </div>
  );
}

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabGroupProps {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

export function TabGroup({ tabs, active, onChange, className = '' }: TabGroupProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2 rounded-xl text-[11px] font-black transition-all flex items-center gap-1.5 ${
            active === tab.id
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'bg-white border border-slate-100 text-slate-500 hover:border-indigo-300 hover:text-slate-800'
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

interface SectionHeaderProps {
  badge?: string;
  title: string;
  description?: string;
}

export function SectionHeader({ badge, title, description }: SectionHeaderProps) {
  return (
    <div className="space-y-2 mb-8">
      {badge && (
        <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100">
          {badge}
        </span>
      )}
      <h2 className="text-2xl font-black text-slate-900 italic tracking-tight">{title}</h2>
      {description && (
        <p className="text-slate-400 text-sm font-medium leading-relaxed">{description}</p>
      )}
    </div>
  );
}
