import { Search, Link, ShieldCheck, Globe, Rocket, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";

export default function PageSEOIndex() {
  return (
    <article className="prose-doc">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Search size={11} /> SEO & 검색 노출
        </span>
        <h1 id="index-request" className="text-4xl font-black italic tracking-tighter text-slate-900 leading-tight mb-4">
          색인 요청 완벽 가이드
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          구글 서치 콘솔에 사이트맵/RSS를 제출했다면, 이제 색인 속도를 최대한 앞당기는 방법을 알아봅니다.
        </p>
      </div>

      {/* 색인이 0인 이유 */}
      <h2 id="why-zero" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        실적이 0인 것은 정상입니다
      </h2>
      <div className="p-5 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3 mb-8">
        <AlertCircle size={20} className="text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-black text-blue-800 mb-1">사이트맵 제출 후 3일~7일은 정상 대기 기간</p>
          <p className="text-xs text-blue-700 font-medium leading-relaxed">
            사이트맵 제출 → 구글 봇 인지 → 색인 생성 → 서치 콘솔 반영까지 보통 3일에서 7일이 소요됩니다.
            조급해하지 마세요. 아래 방법들로 이 속도를 크게 앞당길 수 있습니다.
          </p>
        </div>
      </div>

      {/* 방법 0: 자동 색인 봇 (마자 스튜디오) */}
      <h2 id="auto-indexing" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
        <Sparkles className="text-indigo-600" />
        방법 0. 마자 스튜디오 자동 색인 봇 설정 (강력 추천)
      </h2>
      <p className="text-sm text-slate-600 font-medium mb-5 leading-relaxed">
        매번 새 글을 발행할 때마다 구글 서치 콘솔에 들어가서 색인 요청을 누르는 것은 너무 번거롭습니다. 마자 스튜디오의 전용 봇을 소유자로 추가하면 <strong>글이 발행될 때마다 자동으로 구글에 핑(Ping)을 쏴서 즉시 색인을 요청</strong>합니다.
      </p>

      <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl mb-12">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-xs font-black shrink-0">1</div>
            <p className="text-sm font-semibold text-slate-700 leading-relaxed mt-1">구글 서치 콘솔 좌측 하단의 <strong>[설정]</strong> 메뉴로 이동합니다.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-xs font-black shrink-0">2</div>
            <p className="text-sm font-semibold text-slate-700 leading-relaxed mt-1"><strong>[사용자 및 권한]</strong>을 클릭하고 우측 상단의 <strong>[사용자 추가]</strong> 버튼을 누릅니다.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-xs font-black shrink-0">3</div>
            <div className="flex-1 mt-1">
              <p className="text-sm font-semibold text-slate-700 leading-relaxed mb-2">
                이메일 주소에 아래의 <strong>마자 스튜디오 봇 이메일</strong>을 복사해서 붙여넣습니다.
              </p>
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <code className="text-[11px] font-mono text-indigo-600 break-all select-all">maza-indexing-bot@project-9122c26c-0268-4aad-b51.iam.gserviceaccount.com</code>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-xs font-black shrink-0">4</div>
            <p className="text-sm font-semibold text-slate-700 leading-relaxed mt-1">권한을 반드시 <strong>[소유자 (Owner)]</strong>로 선택하고 추가합니다. 끝입니다!</p>
          </div>
        </div>
      </div>

      {/* 방법 1: 수동 색인 요청 */}
      <h2 id="manual-request" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        방법 1. 수동 색인 요청 (가장 빠름)
      </h2>
      <p className="text-sm text-slate-600 font-medium mb-5">
        구글 봇을 직접 '호출'하는 방법입니다. 가장 즉각적인 효과가 있습니다.
      </p>

      <div className="space-y-3 mb-8">
        {[
          { step: '1', text: '구글 서치 콘솔 접속 (search.google.com/search-console)' },
          { step: '2', text: '상단 검색창에 블로그 메인 주소 입력 (예: https://mazastory.com/)' },
          { step: '3', text: '\'URL이 Google에 있음\' 또는 \'URL 검사\' 결과 화면에서 [색인 생성 요청] 클릭' },
          { step: '4', text: '\'요청이 대기열에 추가됨\' 메시지 확인 → 완료!' },
        ].map((s) => (
          <div key={s.step} className="flex items-start gap-3 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-black shrink-0">
              {s.step}
            </div>
            <p className="text-sm font-semibold text-slate-700 leading-relaxed">{s.text}</p>
          </div>
        ))}
      </div>

      {/* 메인 주소 vs 개별 글 */}
      <h2 id="main-vs-individual" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        메인 주소 vs 개별 글 주소, 무엇을 넣나요?
      </h2>

      <div className="grid md:grid-cols-2 gap-5 mb-8">
        <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <h4 className="text-sm font-black text-emerald-800">메인 주소 (기본, 대부분의 경우)</h4>
          </div>
          <p className="text-xs font-medium text-emerald-700 leading-relaxed">
            <code className="bg-emerald-100 px-1.5 py-0.5 rounded font-mono">https://mazastory.com/</code>
            만 넣으면 충분합니다. 구글 봇이 메인 페이지에 방문해 최신 글들의 링크를 스스로 타고 들어가 색인해갑니다.
          </p>
          <p className="text-[11px] font-black text-emerald-600 uppercase tracking-wider">
            처음 사이트 만들 때 / 카테고리 개편 후 → 1회만
          </p>
        </div>

        <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl space-y-3">
          <div className="flex items-center gap-2">
            <Rocket size={16} className="text-amber-600" />
            <h4 className="text-sm font-black text-amber-800">개별 글 주소 (긴급 핵심 글)</h4>
          </div>
          <p className="text-xs font-medium text-amber-700 leading-relaxed">
            "이 글은 1시간 만에 당장 구글에 띄워야 해!" 라는 특정 핵심 글이 있을 때만 해당 글의 전체 URL 주소를 개별적으로 넣으세요.
          </p>
          <p className="text-[11px] font-black text-amber-600 uppercase tracking-wider">
            경쟁 키워드 선점이 필요한 특정 글에만 사용
          </p>
        </div>
      </div>

      {/* 한글 URL 인코딩 */}
      <h2 id="korean-url" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        한글 제목이 외계어(%기호)로 변환되는 현상
      </h2>
      <p className="text-sm text-slate-600 font-medium mb-4">
        글 제목이 한글이면 주소창의 URL을 복사할 때 아래처럼 % 기호가 잔뜩 붙은 '외계어'로 변환될 수 있습니다.
      </p>
      <div className="p-4 bg-slate-900 rounded-xl mb-4 font-mono text-xs text-slate-400 overflow-x-auto">
        <span className="text-slate-600">복사 전: </span>https://mazastory.com/맛집-리뷰<br />
        <span className="text-slate-600">붙여넣기: </span><span className="text-emerald-400">https://mazastory.com/%EB%A7%9B%EC%A7%91-%EB%A6%AC%EB%B7%B0</span>
      </div>
      <div className="p-5 bg-teal-50 border border-teal-200 rounded-2xl flex items-start gap-3 mb-8">
        <CheckCircle2 size={18} className="text-teal-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-black text-teal-800 mb-1">이것은 완전히 정상입니다! 그대로 넣으세요.</p>
          <p className="text-xs text-teal-700 font-medium leading-relaxed">
            브라우저가 한글 주소를 컴퓨터가 읽기 편한 기호(URL 인코딩)로 자동 변환해주는 현상입니다.
            구글은 이 '외계어' 주소를 원래의 한글 제목으로 정확히 인식하므로, 변환된 채로 그대로 서치 콘솔에 붙여넣고 엔터를 치시면 완벽합니다.
          </p>
        </div>
      </div>

      {/* 방법 2~4 */}
      <h2 id="other-methods" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        색인 속도를 더 빠르게 하는 추가 방법
      </h2>

      <div className="space-y-4 mb-8">
        {[
          {
            emoji: '🤖',
            title: '방법 2. 오토파일럿 하루 5개 꾸준히 발행 (가장 강력)',
            desc: '구글 봇은 매일 꾸준히 글이 올라오는 사이트를 "살아있는 사이트"로 인식하고 크롤링 주기를 짧게 유지합니다. 나중에는 글이 올라오자마자 수분 내에 색인되는 수준에 이르게 됩니다. 오토파일럿이 이미 이 패턴을 자동으로 만들어주고 있습니다.',
            highlight: true,
          },
          {
            emoji: '🔗',
            title: '방법 3. 외부 플랫폼에 링크 공유 (마중물 효과)',
            desc: '트위터(X), 핀터레스트, 네이버 지식iN, 관련 커뮤니티 등에 최신 글 링크를 2~3개만 공유해두세요. 구글 봇이 다른 사이트에서 링크를 타고 들어와 블로그 전체를 순식간에 훑어갑니다.',
          },
          {
            emoji: '⚡',
            title: '방법 4. Google Indexing API 연동 (고급, 필요 시)',
            desc: '글이 발행되는 즉시 1초 만에 구글에 색인 신호를 보내는 API입니다. 현재 규모에서는 필요 없지만, 블로그가 더 커지면 Maza Studio에 직접 구축 가능합니다.',
          },
        ].map((m, i) => (
          <div
            key={i}
            className={`p-5 rounded-2xl border ${
              m.highlight
                ? 'bg-indigo-50 border-indigo-200'
                : 'bg-white border-slate-100 shadow-sm'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">{m.emoji}</span>
              <div>
                <h4 className="text-sm font-black text-slate-800 mb-1.5">{m.title}</h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">{m.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="p-6 bg-slate-900 rounded-2xl text-white">
        <h3 className="text-base font-black mb-3 flex items-center gap-2">
          <Globe size={16} className="text-indigo-400" /> 지금 당장 해야 할 것
        </h3>
        <div className="space-y-2">
          {[
            '서치 콘솔 상단 검색창에 https://mazastory.com/ 입력',
            '[색인 생성 요청] 버튼 클릭',
            '오토파일럿이 하루 5개씩 꾸준히 발행하도록 유지',
            '3~7일 후 서치 콘솔에서 노출수 확인',
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
              {t}
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
