import { useEffect, useState, useRef } from 'react';

interface Heading {
  id: string;
  title: string;
  level: 2 | 3;
}

interface DocsTOCProps {
  headings: Heading[];
}

export default function DocsTOC({ headings }: DocsTOCProps) {
  const [activeId, setActiveId] = useState<string>('');
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    observer.current = new IntersectionObserver(
      entries => {
        // 가장 위에 보이는 heading을 활성화
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-60px 0px -70% 0px', threshold: 0 }
    );

    headings.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) observer.current?.observe(el);
    });

    return () => observer.current?.disconnect();
  }, [headings]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (headings.length === 0) return null;

  return (
    <nav className="py-6 px-4 space-y-1">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-2">On this page</p>
      {headings.map(h => {
        const isActive = activeId === h.id;
        return (
          <button
            key={h.id}
            onClick={() => scrollTo(h.id)}
            className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-all flex items-center gap-2 group ${
              h.level === 3 ? 'pl-5' : ''
            } ${
              isActive
                ? 'text-indigo-600 font-black bg-indigo-50'
                : 'text-slate-500 hover:text-slate-800 font-semibold hover:bg-slate-50'
            }`}
          >
            {isActive && (
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
            )}
            <span className={`leading-snug truncate ${!isActive ? 'ml-3.5' : ''}`}>{h.title}</span>
          </button>
        );
      })}
    </nav>
  );
}
