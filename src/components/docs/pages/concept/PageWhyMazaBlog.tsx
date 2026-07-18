import React from 'react';
import { 
  Heart, Coins, DollarSign, CalendarClock, ShieldCheck, 
  Bot, ShieldAlert, Zap, Layers, Rocket, MonitorSmartphone, 
  Globe2, Settings2, Database
} from 'lucide-react';

export default function PageWhyMazaBlog() {
  return (
    <article className="prose-doc pb-24">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Heart size={11} /> Concept
        </span>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight mb-4">
          왜 무조건 '마자 블로그'인가?
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          수익화 블로거들이 기존 플랫폼(티스토리, 워드프레스)을 버리고 
          <strong>마자 블로그(Maza Blog)</strong>로 넘어올 수밖에 없는 14가지 절대 규칙과 강력한 장점을 소개합니다.
        </p>
      </div>

      <div className="space-y-12">
        {/* Section 1 */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
            <Coins className="text-amber-500" /> 제약 없는 무한 수익 창출 (Monetization Freedom)
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
                <span className="bg-amber-100 text-amber-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                외부 제휴 링크 무한 허용
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                티스토리나 네이버처럼 쿠팡 파트너스 링크로 인한 저품질(섀도우 밴) 걱정이 없습니다. 
                100% 독립 소유이므로 쿠팡, 텐핑, 클릭뱅크 등 수익이 되는 모든 어필리에이트 링크를 마음껏 꽂을 수 있는 진정한 수익화 요새입니다.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
                <span className="bg-amber-100 text-amber-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                워드프레스 압살하는 비용 절감
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                매달 나가는 비싼 호스팅비와 유료 플러그인 구독료가 없습니다. 
                최신 서버리스(Vercel, Netlify) 기술을 사용해 고정 서버비가 사실상 0원에 가까워 비용 대비 수익률(ROI)이 극대화됩니다.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
            <CalendarClock className="text-indigo-500" /> 시공간을 초월하는 포스팅 컨트롤
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
                <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                타임머신 캘린더 (과거/미래 조작)
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                텅 빈 신규 블로그라도 단 하루 만에 '지난 한 달 동안 매일 꾸준히 글을 쓴 것처럼' 조작하여 애드센스 심사를 즉시 패스할 수 있습니다.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
                <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">4</span>
                휴먼-라이크 지연 시스템
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                정각에 쏟아지는 기계식 포스팅 대신, 자연스러운 랜덤 지연(Jitter)을 주어 구글 봇이 '사람이 직접 운영하는 블로그'로 완벽히 착각하게 만듭니다.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
            <ShieldCheck className="text-emerald-500" /> 무적의 생존력 & 퀄리티 보장
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-slate-800 flex items-start gap-2 mb-3">
                <span className="bg-emerald-100 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">5</span>
                원클릭 애드센스 자동 복구
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                원클릭 버튼 하나면 AI가 글을 1500자로 뻥튀기하고 고화질 이미지를 채워 심사 통과 규격으로 자동 튜닝합니다.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-slate-800 flex items-start gap-2 mb-3">
                <span className="bg-emerald-100 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">6</span>
                밴(Ban) 걱정 없는 자유도
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                플랫폼의 갑작스러운 운영 정책 변경이나 데이터센터 화재 사태로부터 내 소중한 디지털 자산을 완벽하게 방어합니다.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-slate-800 flex items-start gap-2 mb-3">
                <span className="bg-emerald-100 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">7</span>
                위험 키워드 회피 자동 쉴드
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                정책 위반 키워드가 포함되면 AI가 스스로 감지해 '수익 창출에 안전한 건전 키워드'로 자동 교체하여 계정 정지를 차단합니다.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
            <Zap className="text-purple-500" /> 미친 생산성 & 초고속 인프라
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-6">
              <h3 className="font-bold text-purple-900 flex items-center gap-2 mb-3">
                <span className="bg-purple-200 text-purple-800 w-6 h-6 rounded-full flex items-center justify-center text-xs">8</span>
                100% 백그라운드 오토파일럿
              </h3>
              <p className="text-sm text-purple-800 leading-relaxed">
                PC나 브라우저를 켜둘 필요가 없습니다. 잠자는 동안에도 클라우드 서버단에서 24시간 내내 알아서 글을 작성하고 예약 발행합니다.
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-6">
              <h3 className="font-bold text-purple-900 flex items-center gap-2 mb-3">
                <span className="bg-purple-200 text-purple-800 w-6 h-6 rounded-full flex items-center justify-center text-xs">9</span>
                블루프린트 대량 복제
              </h3>
              <p className="text-sm text-purple-800 leading-relaxed">
                상위 카테고리를 알아서 넘나들며 고품질 롱테일 키워드 100개를 순식간에 기획하고 세팅하는 똑똑한 다중 생성 시스템입니다.
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-6">
              <h3 className="font-bold text-purple-900 flex items-center gap-2 mb-3">
                <span className="bg-purple-200 text-purple-800 w-6 h-6 rounded-full flex items-center justify-center text-xs">10</span>
                코어 웹 바이탈 100점 극강 속도
              </h3>
              <p className="text-sm text-purple-800 leading-relaxed">
                무거운 워드프레스와 달리 Astro 기반으로 0.1초 만에 렌더링 됩니다. 구글 검색 상단 노출에서 엄청난 가산점을 받습니다.
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-6">
              <h3 className="font-bold text-purple-900 flex items-center gap-2 mb-3">
                <span className="bg-purple-200 text-purple-800 w-6 h-6 rounded-full flex items-center justify-center text-xs">11</span>
                플러그인 없는 프리미엄 디자인
              </h3>
              <p className="text-sm text-purple-800 leading-relaxed">
                비싼 테마 없이도 글래스모피즘, 다크모드, 자동 목차(TOC) 등 하이엔드 반응형 디자인이 최초 세팅부터 완벽하게 탑재되어 있습니다.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
            <Globe2 className="text-blue-500" /> 확장성 & 데이터 주권
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 flex items-start gap-2 mb-3">
                <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">12</span>
                무한 서브도메인 & 다국어
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                도메인 1개로 수십 개의 서브도메인을 찍어내고 다국어를 지원해 단가가 높은 글로벌 달러 타겟팅 블로그를 쉽게 양산합니다.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 flex items-start gap-2 mb-3">
                <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">13</span>
                개발자 없는 원터치 인프라
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                애드센스와 GA4 아이디만 복붙하면 ads.txt, robots.txt 등 복잡한 인프라 세팅이 단 1초 만에 자동 이식됩니다.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 flex items-start gap-2 mb-3">
                <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">14</span>
                완벽한 데이터 주권
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                모든 글은 내 전용 DB에 영구 저장되며, 언제든 통째로 백업받거나 다른 곳으로 이사 갈 수 있는 완전한 통제권을 가집니다.
              </p>
            </div>
          </div>
        </section>

      </div>
    </article>
  );
}
