import React, { useState } from 'react';
import { Search, Server, Settings, CheckCircle2, XCircle, FileCode2, Globe2, Bot, AlertTriangle } from 'lucide-react';

export default function PageDemoAdsense() {
  const [domain, setDomain] = useState('autosite.kr');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;
    setIsScanning(true);
    setScanResult(null);
    
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        domain,
        score: 80,
        checks: [
          { name: 'AdSense 스크립트 (<head>)', status: 'pass', desc: 'pagead2.googlesyndication.com 및 adsense_pub ID 존재' },
          { name: 'ads.txt 루트 도메인', status: 'pass', desc: '퍼블리셔 ID가 포함된 ads.txt 파일 접근 성공' },
          { name: 'robots.txt 접근성', status: 'pass', desc: '구글 봇 크롤링 허용 설정 확인' },
          { name: 'Google Search Console', status: 'pass', desc: '소유권 확인 메타 태그 존재' },
          { name: 'GA4 연동', status: 'fail', desc: '측정 ID(G-XXXX)가 누락되었습니다.' },
        ]
      });
    }, 2500);
  };

  return (
    <article className="prose-doc pb-24">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Server size={11} /> Interactive Demo
        </span>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight mb-4">
          애드센스 승인 전 Infra 검사 데모
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          블로그 글이 아무리 좋아도 <strong>인프라 세팅(스크립트 누락, ads.txt 오류)</strong>이 잘못되면 애드센스 승인은 거절됩니다. 
          마자 스튜디오의 5단계 모의 심사(Pre-Flight Check)를 데모로 체험해 보세요.
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 mb-16">
        <div className="max-w-2xl mx-auto">
          
          <form onSubmit={handleScan} className="mb-8 relative">
            <div className="relative flex items-center">
              <Globe2 className="absolute left-4 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="검사할 도메인 주소 (예: mysite.com)"
                className="w-full bg-white border-2 border-slate-200 rounded-xl py-4 pl-12 pr-32 text-lg focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              />
              <button 
                type="submit"
                disabled={isScanning}
                className="absolute right-2 top-2 bottom-2 bg-slate-800 hover:bg-slate-900 text-white px-6 rounded-lg font-bold transition-colors flex items-center gap-2"
              >
                {isScanning ? '검사 중...' : '스캔 시작'}
              </button>
            </div>
          </form>

          {isScanning && (
            <div className="text-center py-16">
              <div className="inline-block relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
                <Search size={48} className="text-blue-500 animate-spin-slow relative z-10 mx-auto mb-4" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Googlebot 크롤러 시뮬레이션 중...</h3>
              <p className="text-slate-500 text-sm">Edge 캐시를 우회하여 실제 배포된 HTML과 메타데이터를 분석하고 있습니다.</p>
              
              <div className="max-w-md mx-auto mt-6 bg-slate-200 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-500 h-full w-full origin-left animate-progress"></div>
              </div>
            </div>
          )}

          {scanResult && !isScanning && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2 mb-1">
                    {scanResult.score >= 100 ? (
                      <><CheckCircle2 className="text-emerald-500" /> 완벽 대비 완료</>
                    ) : (
                      <><AlertTriangle className="text-amber-500" /> 일부 보완 필요</>
                    )}
                  </h3>
                  <p className="text-slate-500 text-sm">대상: <strong>https://{scanResult.domain}</strong></p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-slate-900">{scanResult.score}<span className="text-lg text-slate-400">/100</span></div>
                  <div className="text-xs text-slate-500 font-medium">통과율</div>
                </div>
              </div>

              <div className="space-y-3">
                {scanResult.checks.map((check: any, idx: number) => (
                  <div key={idx} className={`flex items-start gap-4 p-4 rounded-xl border ${check.status === 'pass' ? 'bg-white border-emerald-100' : 'bg-rose-50 border-rose-200'}`}>
                    <div className="mt-0.5">
                      {check.status === 'pass' ? (
                        <CheckCircle2 className="text-emerald-500" size={20} />
                      ) : (
                        <XCircle className="text-rose-500" size={20} />
                      )}
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm ${check.status === 'pass' ? 'text-slate-800' : 'text-rose-900'}`}>{check.name}</h4>
                      <p className={`text-xs mt-1 ${check.status === 'pass' ? 'text-slate-500' : 'text-rose-700'}`}>{check.desc}</p>
                    </div>
                    {check.status === 'fail' && (
                      <button className="ml-auto text-xs bg-rose-100 text-rose-700 px-3 py-1.5 rounded font-bold hover:bg-rose-200 transition-colors">
                        자동 수정(Fix)
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-3">
          왜 승인 전 검사가 중요한가요?
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Bot className="text-blue-500" /> 구글봇 크롤링 실패 방지
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              <code>robots.txt</code>나 <code>ads.txt</code> 파일이 없거나 잘못 설정되어 있으면, 구글봇이 사이트를 아예 읽지 못해 
              <strong>"사이트가 다운되었거나 사용할 수 없음"</strong> 이라는 치명적인 거절 사유를 받게 됩니다.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <FileCode2 className="text-amber-500" /> SSR(서버 사이드 렌더링) 누락
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              애드센스 스크립트가 리액트 컴포넌트 내부(클라이언트)에만 숨겨져 있으면 봇이 인식하지 못합니다. 
              Maza Studio는 반드시 HTML <code>&lt;head&gt;</code> 최상단에 스크립트가 정상 주입되었는지 검증합니다.
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
