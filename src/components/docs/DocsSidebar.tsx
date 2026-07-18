import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { DOCS_TREE, DocSection } from '../../data/docsTree';

interface DocsSidebarProps {
  onNavigate?: () => void;
}

export default function DocsSidebar({ onNavigate }: DocsSidebarProps) {
  const { sectionId, pageId } = useParams<{ sectionId: string; pageId: string }>();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    // 현재 섹션은 기본적으로 열려있음
    const initial: Record<string, boolean> = {};
    DOCS_TREE.forEach(s => {
      initial[s.id] = s.id === sectionId;
    });
    return initial;
  });

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getColorClasses = (color: string, isActive: boolean) => {
    const map: Record<string, { icon: string; activeBg: string; activeText: string }> = {
      indigo: { icon: 'text-indigo-500', activeBg: 'bg-indigo-50', activeText: 'text-indigo-700' },
      sky: { icon: 'text-sky-500', activeBg: 'bg-sky-50', activeText: 'text-sky-700' },
      emerald: { icon: 'text-emerald-500', activeBg: 'bg-emerald-50', activeText: 'text-emerald-700' },
      amber: { icon: 'text-amber-500', activeBg: 'bg-amber-50', activeText: 'text-amber-700' },
      teal: { icon: 'text-teal-500', activeBg: 'bg-teal-50', activeText: 'text-teal-700' },
      rose: { icon: 'text-rose-500', activeBg: 'bg-rose-50', activeText: 'text-rose-700' },
      violet: { icon: 'text-violet-500', activeBg: 'bg-violet-50', activeText: 'text-violet-700' },
    };
    return map[color] ?? map.indigo;
  };

  return (
    <nav className="h-full overflow-y-auto py-6 px-3 space-y-1">
      {/* Header */}
      <div className="px-3 pb-4 mb-2 border-b border-slate-100">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Documentation</p>
        <p className="text-xs font-bold text-slate-500 mt-0.5">v9.1 · Maza Autopilot OS</p>
      </div>

      {DOCS_TREE.map((section: DocSection) => {
        const isOpen = openSections[section.id] ?? false;
        const SectionIcon = section.icon;
        const colors = getColorClasses(section.color, false);
        const isSectionActive = section.id === sectionId;

        return (
          <div key={section.id}>
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all group ${
                section.id === 'golden-path'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20 hover:from-amber-600 hover:to-orange-600'
                  : section.id === 'demos'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md shadow-teal-500/20 hover:from-teal-600 hover:to-emerald-600'
                  : isSectionActive
                    ? 'bg-slate-100 text-slate-800'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <SectionIcon size={15} className={section.id === 'golden-path' ? 'text-amber-100' : section.id === 'demos' ? 'text-teal-100' : colors.icon} />
              <span className="flex-1 text-xs font-black uppercase tracking-tight">{section.title}</span>
              {isOpen
                ? <ChevronDown size={13} className={`transition-transform ${section.id === 'golden-path' ? 'text-amber-200' : section.id === 'demos' ? 'text-teal-200' : 'text-slate-400'}`} />
                : <ChevronRight size={13} className={`transition-transform ${section.id === 'golden-path' ? 'text-amber-200' : section.id === 'demos' ? 'text-teal-200' : 'text-slate-400'}`} />
              }
            </button>

            {/* Pages */}
            {isOpen && (
              <div className="ml-3 mt-1 mb-2 pl-3 border-l border-slate-100 space-y-0.5">
                {section.pages.map(page => {
                  const isActive = page.sectionId === sectionId && page.pageId === pageId;
                  const PageIcon = page.icon;
                  const pColors = getColorClasses(section.color, isActive);

                  return (
                    <Link
                      key={page.pageId}
                      to={`/docs/${page.sectionId}/${page.pageId}`}
                      onClick={onNavigate}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all group ${
                        isActive
                          ? `${pColors.activeBg} ${pColors.activeText} font-black`
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-semibold'
                      }`}
                    >
                      {PageIcon && (
                        <PageIcon
                          size={13}
                          className={isActive ? pColors.activeText : 'text-slate-400 group-hover:text-slate-600'}
                        />
                      )}
                      <span className="text-xs leading-snug truncate">{page.title}</span>
                      {isActive && (
                        <div className={`ml-auto w-1.5 h-1.5 rounded-full bg-current shrink-0`} />
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Footer Links */}
      <div className="pt-4 mt-4 border-t border-slate-100 px-3 space-y-1">
        <a
          href="https://mazastudio.kr"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-2 py-2 text-[11px] font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
        >
          <span>→</span>
          <span>메인 앱으로 이동</span>
        </a>
      </div>
    </nav>
  );
}
