import { Globe, Key, CheckCircle, AlertTriangle } from 'lucide-react';

export default function PageWordpress() {
  return (
    <article className="prose-doc">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Globe size={11} /> Platform
        </span>
        <h1 id="wordpress" className="text-4xl font-black italic tracking-tighter text-slate-900 leading-tight mb-4">
          워드프레스 세팅
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          워드프레스는 <strong className="text-slate-900">REST API</strong> 방식으로 연동합니다.
          애플리케이션 비밀번호를 발급하면 별도 플러그인 없이 자동 발행이 가능합니다.
        </p>
      </div>

      <h2 id="app-password" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        애플리케이션 비밀번호 발급
      </h2>
      <div className="space-y-4 mb-10">
        {[
          { step: '01', title: '워드프레스 관리자 패널 접속', desc: 'yourblog.com/wp-admin 에 접속하여 관리자 계정으로 로그인합니다.' },
          { step: '02', title: '사용자 → 프로필 이동', desc: '좌측 메뉴에서 [사용자] → [프로필]로 이동합니다.' },
          { step: '03', title: '애플리케이션 비밀번호 생성', desc: '페이지 하단 [애플리케이션 비밀번호] 섹션에서 이름(예: "Maza Studio")을 입력하고 [새 애플리케이션 비밀번호 추가]를 클릭합니다.' },
          { step: '04', title: '비밀번호 복사', desc: '생성된 비밀번호(xxxx xxxx xxxx xxxx 형식)를 복사합니다. 이 화면을 닫으면 다시 볼 수 없으니 즉시 저장하세요.' },
          { step: '05', title: '마자 스튜디오에 입력', desc: '마자 스튜디오 마법사 → 플랫폼 설정에서 블로그 URL, 관리자 이메일, 애플리케이션 비밀번호를 입력합니다.' },
        ].map((item) => (
          <div key={item.step} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shrink-0 bg-sky-100 text-sky-700">
              {item.step}
            </div>
            <div>
              <p className="text-sm font-black text-slate-800 mb-1">{item.title}</p>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 id="requirements" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        필수 요구사항
      </h2>
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-2">
          <CheckCircle size={16} className="text-emerald-500" />
          <p className="text-sm font-black text-emerald-800">지원 환경</p>
          <ul className="text-xs text-emerald-700 font-medium space-y-1 list-disc list-inside">
            <li>워드프레스 5.6 이상</li>
            <li>REST API 활성화 (기본값)</li>
            <li>관리자(Administrator) 권한 계정</li>
          </ul>
        </div>
        <div className="p-5 bg-rose-50 border border-rose-100 rounded-2xl space-y-2">
          <AlertTriangle size={16} className="text-rose-500" />
          <p className="text-sm font-black text-rose-800">주의사항</p>
          <ul className="text-xs text-rose-700 font-medium space-y-1 list-disc list-inside">
            <li>일부 보안 플러그인이 REST API를 차단할 수 있음</li>
            <li>Wordfence 등 방화벽 설정 확인 필요</li>
            <li>비밀번호 분실 시 재발급 필요</li>
          </ul>
        </div>
      </div>

      <h2 id="categories" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        카테고리 ID 확인 방법
      </h2>
      <p className="text-sm text-slate-500 font-medium mb-4">
        마자는 글 발행 시 카테고리를 자동으로 지정합니다. 카테고리 ID는 워드프레스 관리자 패널에서 확인할 수 있습니다.
      </p>
      <div className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs mb-8">
        <p className="text-slate-400 mb-2"># 관리자 패널 → 글 → 카테고리</p>
        <p># 카테고리 편집 화면 URL에서 tag_ID 값 확인</p>
        <p className="text-emerald-400 mt-1">https://yourblog.com/wp-admin/term.php?taxonomy=category&tag_ID=<span className="text-amber-400">5</span></p>
      </div>
    </article>
  );
}
