import React from 'react';
import { Rocket, ShieldAlert, Zap, Globe, Coins, Crown } from 'lucide-react';

export default function PageWhyMazaVsWP() {
  return (
    <article className="prose-doc pb-24">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Crown size={11} /> Concept
        </span>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight mb-4">
          워드프레스 vs MAZA Studio
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          구글 애드센스로 월 백만 원, 천만 원의 패시브 인컴을 꿈꾸시나요? 과거에는 워드프레스가 유일한 정답이었지만, 
          이제 <strong>복잡한 코딩과 비싼 유지비 없이 가장 빠르게 글로벌 트래픽을 선점</strong>하는 마자 스튜디오가 압도적인 대안입니다.
        </p>
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Rocket className="text-blue-500" /> 워드프레스 vs MAZA 완벽 비교표
        </h2>
        
        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm mb-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-sm">
                <th className="p-4 font-bold border-b border-slate-200">비교 항목</th>
                <th className="p-4 font-bold border-b border-slate-200 text-slate-500">🐢 워드프레스 (WordPress)</th>
                <th className="p-4 font-bold border-b border-slate-200 text-indigo-700 bg-indigo-50/50">🚀 MAZA Studio</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-slate-100 bg-white">
                <td className="p-4 font-bold text-slate-800">작동 방식</td>
                <td className="p-4 text-slate-500">무거운 PHP + 데이터베이스(DB)</td>
                <td className="p-4 font-bold text-indigo-700 bg-indigo-50/30">초고속 정적 사이트 (DB 없음, 해킹 위험 0%)</td>
              </tr>
              <tr className="border-b border-slate-100 bg-slate-50">
                <td className="p-4 font-bold text-slate-800">로딩 속도 (SEO)</td>
                <td className="p-4 text-slate-500">플러그인 켤수록 느려짐 (최하위)</td>
                <td className="p-4 font-bold text-indigo-700 bg-indigo-50/30">10배 이상 빠름 (Lighthouse 100점)</td>
              </tr>
              <tr className="border-b border-slate-100 bg-white">
                <td className="p-4 font-bold text-slate-800">유지보수 비용</td>
                <td className="p-4 text-slate-500">매월 호스팅비, 도메인비, 플러그인</td>
                <td className="p-4 font-bold text-indigo-700 bg-indigo-50/30">서버 비용 0원 (무료 CDN 글로벌 배포)</td>
              </tr>
              <tr className="border-b border-slate-100 bg-slate-50">
                <td className="p-4 font-bold text-slate-800">글로벌 다국어</td>
                <td className="p-4 text-slate-500">비싼 플러그인 + 번역비 + 서버 터짐</td>
                <td className="p-4 font-bold text-indigo-700 bg-indigo-50/30">클릭 한 번으로 다국어(i18n) 자동 렌더링</td>
              </tr>
              <tr className="border-b border-slate-100 bg-white">
                <td className="p-4 font-bold text-slate-800">콘텐츠 생산</td>
                <td className="p-4 text-slate-500">직접 쓰거나, 챗GPT 복붙 수동 노동</td>
                <td className="p-4 font-bold text-indigo-700 bg-indigo-50/30">키워드만 넣으면 AI가 무제한 자동 포스팅</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="p-4 font-bold text-slate-800 border-r border-slate-100">주요 목적</td>
                <td className="p-4 text-slate-500 border-r border-slate-100">범용 홈페이지, 쇼핑몰, 블로그 등 만능 툴</td>
                <td className="p-4 font-bold text-indigo-700 bg-indigo-50/50">오직 '구글 애드센스 수익 극대화' 전용 무기</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Globe className="text-emerald-500" /> 왜 '다국어'인가? (글로벌 클릭 단가 비교)
        </h2>
        <p className="text-slate-600 mb-6 leading-relaxed">
          한국어로 10시간 고생해서 쓴 글과, 영어로 10분 만에 자동 발행한 글 중 누가 돈을 더 많이 벌까요? 정답은 후자입니다. 
          바로 <strong>국가별 광고 단가(CPC)의 압도적인 차이</strong> 때문입니다.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🇺🇸 🇬🇧</span>
              <h3 className="font-bold text-rose-900">Tier 1 (최상위 시장)</h3>
            </div>
            <p className="text-sm text-rose-700 mb-3">미국, 영국, 호주, 캐나다</p>
            <div className="text-2xl font-black text-rose-600">$0.70 ~ $2.50+</div>
            <p className="text-xs text-rose-500 mt-2">압도적인 수익 창출의 엘리트 시장</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🇯🇵 🇩🇪</span>
              <h3 className="font-bold text-blue-900">Tier 2 (황금 밸런스)</h3>
            </div>
            <p className="text-sm text-blue-700 mb-3">일본, 독일, 프랑스 등</p>
            <div className="text-2xl font-black text-blue-600">$0.40 ~ $1.20</div>
            <p className="text-xs text-blue-500 mt-2">트래픽과 단가의 완벽한 조화</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🇰🇷 🇪🇸</span>
              <h3 className="font-bold text-slate-700">Tier 3 (일반 시장)</h3>
            </div>
            <p className="text-sm text-slate-500 mb-3">한국, 스페인, 브라질 등</p>
            <div className="text-xl font-black text-slate-600">$0.15 ~ $0.50</div>
            <p className="text-xs text-slate-400 mt-2">막대한 트래픽으로 승부하는 시장</p>
          </div>
          
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 opacity-70">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🇮🇳 🇻🇳</span>
              <h3 className="font-bold text-slate-700">Tier 4 (박리다매)</h3>
            </div>
            <p className="text-sm text-slate-500 mb-3">인도, 동남아시아 등</p>
            <div className="text-xl font-black text-slate-600">$0.05 이하</div>
            <p className="text-xs text-slate-400 mt-2">트래픽 대비 수익이 낮은 시장</p>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
          <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
            <Coins size={18} /> Maza Studio의 강력한 무기
          </h4>
          <p className="text-sm text-emerald-800 leading-relaxed">
            한국(Tier 3)에서 10명이 클릭해서 벌 돈을, <strong>미국(Tier 1)에서는 단 1명의 클릭만으로</strong> 벌 수 있습니다. 
            Maza Studio는 이 글로벌 Tier 1~2 시장을 번역 비용 0원으로 즉시 타격할 수 있게 해줍니다.
          </p>
        </div>
      </section>
    </article>
  );
}
