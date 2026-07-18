import React from 'react';
import { LineChart, CalendarDays, Globe2, Sparkles, TrendingUp, AlertTriangle, ArrowRightCircle } from 'lucide-react';

export default function PageSEOStrategy() {
  return (
    <article className="prose-doc pb-24">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <LineChart size={11} /> Strategy
        </span>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight mb-4">
          SEO 최적화 및 발행 전략
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          오토파일럿 시스템을 활용하여 구글 샌드박스 페널티를 피하고 검색 상단에 노출되기 위한 
          <strong>안전하고 강력한 일일 발행량(Velocity) 조절 전략</strong>과 다국어 믹싱 기법을 안내합니다.
        </p>
      </div>

      {/* Section 1 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
          <TrendingUp className="text-blue-500" /> 일일 발행 한도 전략 (Publishing Velocity)
        </h2>
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 mb-8 flex gap-4">
          <AlertTriangle size={24} className="text-rose-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-rose-900 mb-2">구글 샌드박스(Sandbox) 페널티 주의</h3>
            <p className="text-sm text-rose-800 leading-relaxed">
              신생 사이트가 하루에 수십 개의 글을 갑자기 쏟아내면 구글은 이를 스팸(어뷰징)으로 간주하여 검색 노출을 완전히 차단합니다. 
              따라서 블로그의 연차에 따라 점진적으로 발행량을 늘려가는 것이 핵심입니다.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative overflow-hidden group hover:border-slate-300 transition-colors">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-300"></div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 mb-2">
                  <CalendarDays size={18} className="text-slate-500" /> 1단계: 에이징 기간 (1~3주 차)
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                  구글 봇에게 "사람이 정성껏 관리하는 정상적인 사이트"라는 신뢰를 주는 기간입니다. 
                  애드센스 승인을 위해 양보다 꾸준함이 중요합니다.
                </p>
              </div>
              <div className="bg-slate-100 text-slate-700 font-black px-4 py-3 rounded-lg text-center whitespace-nowrap">
                하루 3~5개
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-colors">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-400"></div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 mb-2">
                  <TrendingUp size={18} className="text-blue-500" /> 2단계: 성장 기간 (1달 이후)
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                  애드센스 승인이 완료되고 검색 결과에 글이 노출되기 시작하는 단계입니다. 
                  시스템이 사이트를 신뢰하기 시작했으므로 발행량을 살짝 늘립니다.
                </p>
              </div>
              <div className="bg-blue-50 text-blue-700 font-black px-4 py-3 rounded-lg text-center whitespace-nowrap">
                하루 7~9개
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-colors">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 mb-2">
                  <Sparkles size={18} className="text-emerald-500" /> 3단계: 트래픽 폭발 (2달 이후)
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                  도메인 점수(Authority)가 충분히 높아져 구글이 '거대 미디어 사이트'로 인정하는 단계입니다. 
                  이때부터 오토파일럿 한도를 최대로 올려 대량 생산 체제로 진입합니다.
                </p>
              </div>
              <div className="bg-emerald-50 text-emerald-700 font-black px-4 py-3 rounded-lg text-center whitespace-nowrap">
                하루 10~15개
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
          <Globe2 className="text-purple-500" /> 다국어 혼합 발행 전략 (Language Mixing)
        </h2>
        <p className="text-slate-600 mb-6 leading-relaxed">
          한국어(KR), 영어(EN), 일본어(JA)를 섞어서 발행하는 것은 SEO 관점에서 매우 강력한 메리트를 제공합니다.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
              <Globe2 size={18} /> 글로벌 타겟팅 가산점
            </h3>
            <p className="text-sm text-purple-800 leading-relaxed">
              Maza Blog 템플릿은 언어별 주소 체계(<code>/en</code>, <code>/ja</code>)와 번역 시스템이 기술적으로 완벽히 분리되어 있습니다. 
              구글은 이를 혼란스러워하지 않고 "글로벌 독자를 타겟팅하는 훌륭한 사이트"로 인식하여 검색 랭킹에 가산점을 줍니다.
            </p>
          </div>
          
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 flex flex-col justify-center">
            <h3 className="font-bold text-indigo-900 mb-4 text-center">💡 추천 언어 발행 비율 (예시: 일 5개)</h3>
            <div className="flex justify-between items-center gap-2">
              <div className="flex-1 bg-white border border-indigo-100 rounded-lg py-3 text-center shadow-sm">
                <div className="text-2xl mb-1">🇰🇷</div>
                <div className="font-bold text-indigo-900">한국어 2개</div>
              </div>
              <div className="flex-1 bg-white border border-indigo-100 rounded-lg py-3 text-center shadow-sm">
                <div className="text-2xl mb-1">🇺🇸</div>
                <div className="font-bold text-indigo-900">영어 2개</div>
              </div>
              <div className="flex-1 bg-white border border-indigo-100 rounded-lg py-3 text-center shadow-sm">
                <div className="text-2xl mb-1">🇯🇵</div>
                <div className="font-bold text-indigo-900">일본어 1개</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
          <Sparkles className="text-amber-500" /> 실전 오토파일럿 운영 팁
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="mt-1 text-amber-500"><ArrowRightCircle size={20} /></div>
            <div>
              <h4 className="font-bold text-slate-800 mb-1">대기열(Queue) 넉넉히 채우기</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                블루프린트를 통해 각 언어별로 글을 30~50개씩 미리 생성하여 'Queue' 상태로 넉넉히 쌓아둡니다.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="mt-1 text-amber-500"><ArrowRightCircle size={20} /></div>
            <div>
              <h4 className="font-bold text-slate-800 mb-1">연차에 맞는 한도 설정</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                오토파일럿의 <code>일일 한도</code> 설정을 현재 블로그의 에이징 단계(1~3단계)에 맞춰서 세팅해 둡니다.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="mt-1 text-amber-500"><ArrowRightCircle size={20} /></div>
            <div>
              <h4 className="font-bold text-slate-800 mb-1">방치 및 모니터링</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                오토파일럿 스케줄러가 매일 정해진 수량만큼 알아서 '발행 완료' 상태로 넘기며 블로그에 노출시킵니다. 대표님은 애드센스 트래픽과 수익만 모니터링하시면 됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
