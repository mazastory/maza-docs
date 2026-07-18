import React from 'react';
import { Globe, Settings, Copy, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function PageDomainGuide() {
  return (
    <article className="prose-doc pb-24">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Globe size={11} /> Guide
        </span>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight mb-4">
          개인 도메인 연결 가이드 (DNS 설정)
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          Maza Studio에서 사이트 배포를 마쳤다면, 구입하신 도메인을 실제 서버(Netlify)와 연결하는 작업이 필요합니다. 
          도메인 구입처(가비아, 호스팅케이알 등)에서 <strong>DNS 레코드 딱 2줄만 추가</strong>하시면 됩니다.
        </p>
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
          <Settings className="text-blue-500" /> 공통 필수 입력 정보
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-slate-50 border-b border-slate-200 p-4">
              <h3 className="font-bold text-slate-800">1. 루트 도메인 (예: mysite.com)</h3>
              <p className="text-xs text-slate-500 mt-1">기본 도메인을 그대로 사용할 경우 2개의 레코드가 필요합니다.</p>
            </div>
            <div className="p-4 space-y-4">
              <div className="bg-slate-50 p-3 rounded border border-slate-100">
                <div className="text-xs font-bold text-blue-600 mb-2">A 레코드 추가</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-slate-500">호스트(이름)</div>
                  <div className="font-mono">@</div>
                  <div className="text-slate-500">값(IP주소)</div>
                  <div className="font-mono text-emerald-600 bg-emerald-50 px-1 rounded flex items-center justify-between">
                    75.2.60.5 <Copy size={14} className="cursor-pointer text-slate-400 hover:text-emerald-600"/>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded border border-slate-100">
                <div className="text-xs font-bold text-indigo-600 mb-2">CNAME 레코드 추가</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-slate-500">호스트(이름)</div>
                  <div className="font-mono">www</div>
                  <div className="text-slate-500">값(목적지)</div>
                  <div className="font-mono break-all">[내주소].netlify.app</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-slate-50 border-b border-slate-200 p-4">
              <h3 className="font-bold text-slate-800">2. 서브 도메인 (예: blog.mysite.com)</h3>
              <p className="text-xs text-slate-500 mt-1">서브 도메인은 IP 주소(A)가 필요 없이 CNAME 딱 1줄만 필요합니다.</p>
            </div>
            <div className="p-4">
              <div className="bg-slate-50 p-3 rounded border border-slate-100">
                <div className="text-xs font-bold text-purple-600 mb-2">CNAME 레코드 추가</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-slate-500">호스트(이름)</div>
                  <div className="font-mono">blog <span className="text-xs text-slate-400 font-sans">(원하는 이름)</span></div>
                  <div className="text-slate-500">값(목적지)</div>
                  <div className="font-mono break-all">[내주소].netlify.app</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
          <Globe className="text-slate-500" /> 호스팅 업체별 요약 가이드
        </h2>
        
        <div className="space-y-4">
          <details className="group bg-white border border-slate-200 rounded-xl [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between p-5 cursor-pointer font-bold text-slate-800">
              <span>가비아 (Gabia)</span>
              <span className="transition group-open:rotate-180">▼</span>
            </summary>
            <div className="px-5 pb-5 text-sm text-slate-600 border-t border-slate-100 pt-4">
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li>[My가비아] ➡️ [DNS 관리툴] ➡️ 설정할 도메인의 [설정] 클릭</li>
                <li>[레코드 추가] 버튼 클릭 후 아래 값 입력</li>
              </ol>
              <div className="bg-amber-50 text-amber-800 p-3 rounded-lg flex gap-2 border border-amber-200">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                <p><strong>주의:</strong> 가비아에서 CNAME 값을 입력할 때는 맨 끝에 점(.)을 꼭 찍어야 합니다! (예: <code>...netlify.app.</code>)</p>
              </div>
            </div>
          </details>

          <details className="group bg-white border border-slate-200 rounded-xl [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between p-5 cursor-pointer font-bold text-slate-800">
              <span>호스팅케이알 (Hosting.kr)</span>
              <span className="transition group-open:rotate-180">▼</span>
            </summary>
            <div className="px-5 pb-5 text-sm text-slate-600 border-t border-slate-100 pt-4">
              <ol className="list-decimal list-inside space-y-2">
                <li>[나의 서비스] ➡️ [도메인 관리] ➡️ 도메인 클릭</li>
                <li>[네임서버/DNS] 탭 선택 ➡️ [새 레코드 추가]</li>
                <li>유형: A, 이름: @, 값: 75.2.60.5 입력 후 적용</li>
              </ol>
            </div>
          </details>
          
          <details className="group bg-white border border-slate-200 rounded-xl [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between p-5 cursor-pointer font-bold text-slate-800">
              <span>클라우드플레어 (Cloudflare)</span>
              <span className="transition group-open:rotate-180">▼</span>
            </summary>
            <div className="px-5 pb-5 text-sm text-slate-600 border-t border-slate-100 pt-4">
              <ol className="list-decimal list-inside space-y-2">
                <li>좌측 메뉴 [DNS] ➡️ [레코드] 이동</li>
                <li>[레코드 추가(Add record)] 클릭</li>
                <li>Type: A, Name: @, IP: 75.2.60.5 (프록시 상태 유지 가능)</li>
              </ol>
            </div>
          </details>
        </div>
      </section>

      <section>
        <div className="bg-slate-900 rounded-xl p-8 text-white">
          <h3 className="font-bold text-emerald-400 mb-3 flex items-center gap-2">
            <ShieldCheck size={20} /> DNS 전파 및 보안 인증서(SSL) 
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            DNS 레코드를 변경한 후, 전 세계 인터넷 망에 이 정보가 퍼지려면 빠르면 5분, 길게는 24~48시간까지 소요될 수 있습니다.
          </p>
          <div className="bg-white/10 p-4 rounded-lg border border-white/10">
            <p className="text-sm text-slate-200">
              💡 <strong>안전하지 않음 오류?</strong><br/>
              설정 직후 도메인 접속 시 '안전하지 않음(보안 인증서 오류)'이 뜨더라도 절대 잘못된 것이 아닙니다. 
              잠시 기다리시면 넷리파이(Netlify)가 백그라운드에서 보안 인증서(SSL) 발급을 자동으로 완료해 줍니다.
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
