import { Search, CheckCircle, Globe, Clock } from 'lucide-react';

export default function PageSitemapRSS() {
  return (
    <article className="prose-doc">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Search size={11} /> SEO
        </span>
        <h1 id="sitemap-rss" className="text-4xl font-black italic tracking-tighter text-slate-900 leading-tight mb-4">
          사이트맵 & RSS 제출
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          구글이 내 블로그의 모든 글을 빠르게 발견하게 하려면
          <strong className="text-slate-900"> 사이트맵과 RSS를 서치콘솔에 제출</strong>해야 합니다.
        </p>
      </div>

      <h2 id="what-is-sitemap" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        사이트맵이란?
      </h2>
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        <div className="p-5 bg-teal-50 border border-teal-100 rounded-2xl">
          <Globe size={18} className="text-teal-500 mb-2" />
          <p className="text-sm font-black text-teal-800 mb-1">사이트맵 (sitemap.xml)</p>
          <p className="text-xs text-teal-700 font-medium leading-relaxed">내 블로그의 모든 URL 목록을 담은 XML 파일. 구글봇이 이 파일을 읽어 모든 글을 발견하고 크롤링합니다.</p>
        </div>
        <div className="p-5 bg-sky-50 border border-sky-100 rounded-2xl">
          <Search size={18} className="text-sky-500 mb-2" />
          <p className="text-sm font-black text-sky-800 mb-1">RSS 피드 (feed.xml / rss.xml)</p>
          <p className="text-xs text-sky-700 font-medium leading-relaxed">최신 글 목록을 실시간으로 제공하는 피드. 새 글이 올라오면 구글이 즉시 감지하고 색인을 시작합니다.</p>
        </div>
      </div>

      <h2 id="platform-urls" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        플랫폼별 사이트맵 주소
      </h2>
      <div className="space-y-3 mb-10">
        {[
          { platform: '티스토리', sitemap: 'https://블로그.tistory.com/sitemap.xml', rss: 'https://블로그.tistory.com/rss' },
          { platform: '블로그스팟', sitemap: 'https://블로그.blogspot.com/sitemap.xml', rss: 'https://블로그.blogspot.com/feeds/posts/default?alt=rss' },
          { platform: '워드프레스', sitemap: 'https://블로그.com/sitemap_index.xml', rss: 'https://블로그.com/feed' },
        ].map((row, i) => (
          <div key={i} className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
            <p className="text-xs font-black text-slate-800 mb-2">{row.platform}</p>
            <div className="space-y-1">
              <p className="text-[10px] font-mono text-teal-600 bg-teal-50 px-2 py-1 rounded">사이트맵: {row.sitemap}</p>
              <p className="text-[10px] font-mono text-sky-600 bg-sky-50 px-2 py-1 rounded">RSS: {row.rss}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 id="submit-steps" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        서치콘솔 제출 방법
      </h2>
      <div className="space-y-4 mb-10">
        {[
          { step: '01', title: 'Google Search Console 접속', desc: 'search.google.com/search-console 에 접속합니다.' },
          { step: '02', title: '속성 선택', desc: '좌측 상단에서 내 블로그 속성(도메인)을 선택합니다.' },
          { step: '03', title: '색인 → Sitemaps 메뉴', desc: '좌측 메뉴에서 [색인] → [Sitemaps] (사이트맵)을 클릭합니다.' },
          { step: '04', title: '사이트맵 URL 입력 & 제출', desc: '위 플랫폼별 사이트맵 URL을 입력하고 [제출] 버튼을 클릭합니다. RSS 피드도 동일하게 추가합니다.' },
        ].map((item) => (
          <div key={item.step} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shrink-0 bg-teal-100 text-teal-700">
              {item.step}
            </div>
            <div>
              <p className="text-sm font-black text-slate-800 mb-1">{item.title}</p>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-5 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
        <Clock size={18} className="text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-black text-amber-800 mb-1">색인 반영까지 시간</p>
          <p className="text-xs text-amber-700 font-medium leading-relaxed">
            사이트맵 제출 후 구글이 모든 글을 색인하는 데 1~4주가 소요됩니다. 서치콘솔에서 상태가 "성공"으로 표시되면 정상입니다. 색인 요청 가이드도 함께 참고하세요.
          </p>
        </div>
      </div>
    </article>
  );
}
