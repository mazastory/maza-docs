import React from 'react';
import { Target, Lightbulb, Compass, Rocket, Blocks, Crosshair, Users, LineChart, Layers } from 'lucide-react';

export default function PageAcademyUseCases() {
  return (
    <article className="prose-doc pb-24">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Target size={11} /> Maza Academy
        </span>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight mb-4">
          실전 활용 사례 (Use Cases)
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          Maza Studio의 강력한 오토파일럿과 다국어 시스템을 활용하여 <strong>실제로 수익을 내고 있는 다양한 비즈니스 모델과 사례</strong>를 소개합니다.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Case 1 */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm group hover:shadow-md transition-shadow">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 p-6 flex items-end">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <Globe2 size={24} /> 글로벌 니치(Niche) 타겟팅
            </h3>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4 text-sm font-bold text-indigo-600">
              <Target size={16} /> 추천 블루프린트: IT 리뷰, 건강, 여행
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              국내 시장의 치열한 경쟁을 피해, 다국어(영어, 일본어 등) 기능을 활용해 단가가 높은 글로벌 Tier 1, 2 국가를 집중 공략하는 모델입니다.
            </p>
            <ul className="text-sm text-slate-500 space-y-2 list-disc list-inside">
              <li>1도메인으로 한국어/영어/일본어 동시 발행</li>
              <li>미국(US) 구글 검색 유입을 통한 고단가 CPC 확보</li>
              <li>블루프린트로 롱테일 키워드 100개 세팅 후 오토파일럿 방치</li>
            </ul>
          </div>
        </div>

        {/* Case 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm group hover:shadow-md transition-shadow">
          <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-600 p-6 flex items-end">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <Blocks size={24} /> 제휴 마케팅 (어필리에이트)
            </h3>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4 text-sm font-bold text-emerald-600">
              <Target size={16} /> 추천 블루프린트: 상품 리뷰, 쿠팡 파트너스
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              저품질(통누락) 걱정 없이 외부 제휴 링크를 무제한으로 삽입하여 애드센스 외의 2차 수익(커미션)을 극대화하는 모델입니다.
            </p>
            <ul className="text-sm text-slate-500 space-y-2 list-disc list-inside">
              <li>티스토리/네이버의 제재에서 100% 해방된 독립 블로그 활용</li>
              <li>글로벌 어필리에이트(아마존, 클릭뱅크) 링크 삽입</li>
              <li>상단/하단/본문 내 원하는 위치에 배너 자유롭게 배치</li>
            </ul>
          </div>
        </div>

        {/* Case 3 */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm group hover:shadow-md transition-shadow">
          <div className="h-32 bg-gradient-to-r from-rose-500 to-orange-500 p-6 flex items-end">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <Crosshair size={24} /> 트렌드 이슈 선점형
            </h3>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4 text-sm font-bold text-rose-600">
              <Target size={16} /> 추천 기능: 마자 이슈 (Trend Hunter)
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              연예, 스포츠, 실시간 뉴스 등 트래픽이 폭발하는 키워드를 실시간으로 포착하여 구글 검색 최상단에 빠르게 꽂아넣는 박리다매 모델입니다.
            </p>
            <ul className="text-sm text-slate-500 space-y-2 list-disc list-inside">
              <li>트렌드 헌터 레이더로 실시간 키워드 원클릭 발행</li>
              <li>Astro SSR의 극강 로딩 속도로 경쟁 블로그보다 빠른 SEO 노출</li>
              <li>Tier 3(한국 등)에서 막대한 트래픽 볼륨으로 승부</li>
            </ul>
          </div>
        </div>

        {/* Case 4 */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm group hover:shadow-md transition-shadow">
          <div className="h-32 bg-gradient-to-r from-purple-500 to-pink-600 p-6 flex items-end">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <Layers size={24} /> 서브도메인 문어발 확장
            </h3>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4 text-sm font-bold text-purple-600">
              <Target size={16} /> 추천 전략: 1도메인 1카테고리 집중
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              애드센스 승인받은 루트 도메인 하나로 수십 개의 서브도메인을 파서 다양한 주제의 블로그 왕국을 건설하는 엔터프라이즈급 모델입니다.
            </p>
            <ul className="text-sm text-slate-500 space-y-2 list-disc list-inside">
              <li>tech.myblog.com, health.myblog.com 등 무한 증식</li>
              <li>주제별 사이트 분리로 구글 문맥 인식을 도와 고단가 CPC 유도</li>
              <li>모든 사이트를 Maza Studio '마이 사이트'에서 통합 컨트롤</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl p-8 text-white text-center">
        <Rocket size={48} className="text-amber-400 mx-auto mb-4" />
        <h3 className="text-2xl font-black text-slate-100 mb-3">어떤 모델을 선택하시겠습니까?</h3>
        <p className="text-slate-400 leading-relaxed max-w-xl mx-auto">
          Maza Studio는 위 모든 비즈니스 모델을 완벽하게 소화할 수 있는 유일한 올인원 플랫폼입니다. 
          여러분의 성향에 맞는 무기를 선택해 지금 바로 <strong>블루프린트를 큐(Queue)에 올려보세요!</strong>
        </p>
      </div>
    </article>
  );
}

// Mock Globe2 component inside file to prevent import errors if missing
const Globe2 = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
    <path d="M2 12h20"></path>
  </svg>
);
