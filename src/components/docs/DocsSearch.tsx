import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, FileText } from 'lucide-react';
import { DOCS_TREE, getAllPages } from '../../data/docsTree';

interface DocsSearchProps {
  open: boolean;
  onClose: () => void;
}

export default function DocsSearch({ open, onClose }: DocsSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const allPages = getAllPages();

  const results = query.trim()
    ? allPages.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        (p.description ?? '').toLowerCase().includes(query.toLowerCase())
      )
    : allPages.slice(0, 8);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (sectionId: string, pageId: string) => {
    navigate(`/docs/${sectionId}/${pageId}`);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleSelect(results[selectedIndex].sectionId, results[selectedIndex].pageId);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const getSectionColor = (sectionId: string) => {
    const section = DOCS_TREE.find(s => s.id === sectionId);
    return section?.color ?? 'indigo';
  };

  const getSectionTitle = (sectionId: string) => {
    return DOCS_TREE.find(s => s.id === sectionId)?.title ?? '';
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="문서 검색... (예: 익스텐션, 색인, 오토파일럿)"
            className="flex-1 text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
          />
          <div className="flex items-center gap-2">
            {query && (
              <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={16} />
              </button>
            )}
            <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-wider">
              ESC
            </kbd>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto py-2">
          {results.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FileText size={32} className="text-slate-200 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-400">'{query}'에 대한 검색 결과가 없습니다.</p>
            </div>
          ) : (
            <>
              {!query && (
                <div className="px-6 py-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">모든 문서</p>
                </div>
              )}
              {results.map((page, idx) => {
                const color = getSectionColor(page.sectionId);
                const isSelected = idx === selectedIndex;
                const PageIcon = page.icon;
                return (
                  <button
                    key={`${page.sectionId}-${page.pageId}`}
                    onClick={() => handleSelect(page.sectionId, page.pageId)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center gap-4 px-6 py-3.5 text-left transition-colors ${
                      isSelected ? 'bg-indigo-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-${color}-100 text-${color}-600`}>
                      {PageIcon ? <PageIcon size={16} /> : <FileText size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-black text-slate-800 truncate">{page.title}</div>
                      {page.description && (
                        <div className="text-[11px] font-medium text-slate-400 truncate">{page.description}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest hidden sm:block">
                        {getSectionTitle(page.sectionId)}
                      </span>
                      {isSelected && <ArrowRight size={14} className="text-indigo-500" />}
                    </div>
                  </button>
                );
              })}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200">↑↓</kbd> 탐색</span>
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200">↵</kbd> 이동</span>
          </div>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{results.length}개 결과</span>
        </div>
      </div>
    </div>
  );
}
