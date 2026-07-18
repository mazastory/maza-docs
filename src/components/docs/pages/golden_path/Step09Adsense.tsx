import React from 'react';
import { Target, Sparkles, DollarSign, ShoppingCart, Users, Tag } from 'lucide-react';

export default function Step09Adsense() {
  return (
    <article className="prose-doc pb-24">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Sparkles size={11} /> Step 9
        </span>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight mb-4">
          수익화 센터 (애드센스 & 제휴)
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          구글 애드센스 승인 신청뿐만 아니라 쿠팡 파트너스, 네이버 브랜드 커넥트 등 다양한 제휴 마케팅 채널을 
          통합 관리하여 블로그의 수익 파이프라인을 다각화합니다.
        </p>
      </div>

      <div className="not-prose rounded-xl border border-slate-200 overflow-hidden mb-16 shadow-sm">
        <img 
          src="/images/docs_monetization.png" 
          alt="마자 스튜디오 수익화 센터 화면" 
          className="w-full h-auto block"
        />
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">지원하는 수익 채널</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 text-rose-500">
              <ShoppingCart size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              쿠팡 파트너스 연동
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              가장 강력한 커머스 수익 모델입니다. 상품 URL만 입력하면 리뷰, 혜택, 제휴 링크를 
              모두 포함한 최적화된 포스팅을 AI가 자동 기획하고 작성합니다.
            </p>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 text-emerald-600">
              <DollarSign size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              구글 애드센스 (자동화)
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              클릭 한 번으로 구글에 승인 심사를 요청하며, 승인 이후 트래픽 기반의 안정적인 
              광고 수익을 얻을 수 있는 필수 1순위 파이프라인입니다.
            </p>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 text-emerald-500">
              <Tag size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              네이버 커넥트 (예정)
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              네이버 블로그를 운영 중인 사용자를 위해 인플루언서 및 브랜드 제휴 원고를 
              AI가 가이드라인에 맞춰 자동으로 기획해 주는 기능입니다.
            </p>
          </div>
          
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 text-indigo-500">
              <Users size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              마자 파트너스
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              나만의 초대 코드를 발급받고, 지인이나 커뮤니티에 마자 스튜디오를 소개하여 
              플랫폼 이용료의 일부를 영구적인 수익으로 공유받을 수 있습니다.
            </p>
          </div>
        </div>
      </section>

    </article>
  );
}
