import { Globe, AlertCircle, Zap } from "lucide-react";
import { Link2, AlertOctagon, Search, SearchCode, Settings, FileCode2, ArrowRight } from 'lucide-react';

export default function PageTistoryCustomDomain() {
  return (
    <article className="prose-doc pb-24">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Link2 size={11} /> Strategy
        </span>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight mb-4">
          티스토리 개인 도메인 연결 가이드
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          티스토리(예: <code>zerowork.tistory.com</code>) 블로그에 개인 도메인(예: <code>autosite.kr</code>)을 연결할 때 발생하는 
          검색 엔진 최적화(SEO) 이슈와 서치콘솔 필수 체크리스트를 총정리했습니다.
        </p>
      </div>

      {/* Section 1: Core Concept */}
      <section className="mb-16">
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-8 mb-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <AlertOctagon size={48} className="text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-rose-900 mb-3">
            검색 엔진은 새 도메인을 "완전히 새로운 사이트"로 인식합니다
          </h2>
          <p className="text-rose-800 leading-relaxed max-w-2xl mx-auto">
            기존에 티스토리 주소로 글을 100개를 썼든, 개인 도메인을 입히는 순간 구글(서치콘솔)과 네이버(서치어드바이저) 입장에서는 
            <strong>"완전히 새로운 깡통 사이트가 생겼다"</strong>고 판단합니다. 
            따라서 모든 검색 엔진 도구에 '새로운 사이트'를 등록하고 세팅하는 과정을 처음부터 다시 진행해야 합니다.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <SearchCode className="text-slate-500" /> 기존 글들의 사이트맵 및 RSS 반영
          </h3>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-slate-100">
              <strong className="text-indigo-600 block mb-1">Q. 20개의 글을 쓴 상태에서 도메인을 연결하면, 21번째 글부터 인식되나요?</strong>
              <p className="text-sm text-slate-600">A. 아닙니다. 개인 도메인을 연결하는 순간 시스템이 자동으로 기존 1~20번째 글들도 모두 새 도메인 기준의 사이트맵과 RSS를 생성합니다.</p>
            </div>
            <p className="text-sm text-slate-500">
              따라서 도메인 연결 전에 쓴 글이라고 해서 검색에서 누락되지 않으며, 과거의 글들도 모두 새 도메인 주소로 검색 엔진에 노출됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Checklist */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
          <Settings className="text-indigo-500" /> 도메인 연결 후 필수 체크리스트 5
        </h2>
        
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
              <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0">1</span>
              웹마스터 도구 재등록 (가장 중요)
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              서치콘솔 및 서치어드바이저에 접속하여 <strong>새로운 속성 추가</strong>로 새 도메인을 등록하고, 
              소유권 확인 후 사이트맵(<code>sitemap.xml</code>)과 <code>rss</code>를 새로 제출해야 합니다.
            </p>
            <div className="bg-indigo-50/50 rounded-lg p-4 text-sm text-indigo-900 border border-indigo-100">
              <strong className="flex items-center gap-1 mb-1"><Zap size={14}/> 꿀팁 (주소 이전 기능 사용하기):</strong>
              새 속성을 등록한 후, <strong>기존 속성의 설정 메뉴에서 [주소 변경]</strong>을 통해 "내가 새 도메인으로 이사했다"라고 
              구글에 신고해 주시면 기존 검색 노출 점수(SEO)를 안전하게 넘겨받을 수 있습니다.
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
              <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0">2</span>
              구글 애드센스 (Google AdSense) 재승인
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              애드센스로 수익을 창출하고 계셨다면 새 도메인을 애드센스의 '사이트' 메뉴에 새로 추가하고 
              <strong>새로 승인(애드고시)</strong>을 받아야 합니다. 또한 티스토리 [수익] 메뉴에서 <code>ads.txt</code> 연동을 다시 확인하세요.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
              <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0">3</span>
              방문자 분석 도구 (GA4 등) URL 변경
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              구글 애널리틱스(GA4) 관리자 설정에서 속성의 기본 URL을 기존 티스토리 주소에서 새 개인 도메인 주소로 변경하여 유입 데이터가 정상 측정되도록 합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3 text-sm">
                <span className="bg-slate-200 text-slate-700 w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0">4</span>
                Canonical 메타 태그
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                티스토리 관리자에서 도메인 보안 접속 인증서 발급이 완료되면, 자동으로 중복 문서 방지를 위한 <code>canonical</code> 태그가 새 도메인으로 변경됩니다. (F12로 확인 가능)
              </p>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3 text-sm">
                <span className="bg-slate-200 text-slate-700 w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0">5</span>
                스킨 내 하드코딩된 링크
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                티스토리 스킨 편집(HTML) 시 메뉴나 로고 등에 기존 티스토리 링크를 직접 적어두셨다면, 모두 새 도메인으로 찾아 바꾸셔야 합니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
