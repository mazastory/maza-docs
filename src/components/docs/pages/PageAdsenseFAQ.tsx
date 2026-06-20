import { Zap, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: '애드센스 신청하면 바로 승인되나요?',
    a: '아니요. 구글 심사팀이 직접 블로그를 검토하며 보통 1~4주가 소요됩니다. 불승인 메일을 받으면 원인을 수정하고 30일 이상 후 재신청하세요.',
  },
  {
    q: '포스트가 몇 개는 있어야 신청할 수 있나요?',
    a: '공식 기준은 없지만 실전 데이터 기준 최소 30개, 각 글 700자 이상을 권장합니다. 40~50개면 훨씬 안정적입니다.',
  },
  {
    q: '블로그 개설 후 며칠 만에 신청해도 되나요?',
    a: '최소 2~4주 이상 운영 이력이 있어야 합니다. 개설 당일이나 3일 내 신청은 거의 모두 거절됩니다.',
  },
  {
    q: '티스토리 기본 도메인으로도 승인이 되나요?',
    a: '네, 가능합니다. yourblog.tistory.com 주소로도 승인 사례가 많습니다. 커스텀 도메인이 필수는 아닙니다.',
  },
  {
    q: '블로그스팟이 티스토리보다 승인이 빠른가요?',
    a: '구글 직영 플랫폼이라 일반적으로 블로그스팟이 더 빠른 편입니다. 하지만 콘텐츠 품질이 핵심이므로 절대적인 차이는 없습니다.',
  },
  {
    q: '승인 후 광고가 바로 표시되나요?',
    a: '승인 직후 자동 광고를 활성화하면 수 시간 내로 광고가 게재됩니다. 단, 콘텐츠 수가 적으면 광고 단가가 낮을 수 있습니다.',
  },
  {
    q: '해외(영어) 블로그로 신청해도 되나요?',
    a: '물론입니다. 영어 콘텐츠는 CPC가 훨씬 높아 수익이 크지만, 품질 기준도 엄격합니다. 한국어 블로그와 동일한 기준을 적용합니다.',
  },
];

export default function PageAdsenseFAQ() {
  return (
    <article className="prose-doc">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <HelpCircle size={11} /> FAQ
        </span>
        <h1 id="adsense-faq" className="text-4xl font-black italic tracking-tighter text-slate-900 leading-tight mb-4">
          애드센스 승인 FAQ
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          애드센스 신청과 승인에 관해 가장 자주 받는 질문들을 정리했습니다.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {faqs.map((faq, i) => (
          <div key={i} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="flex items-start gap-3 mb-2">
              <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">Q</span>
              <p className="text-sm font-black text-slate-800">{faq.q}</p>
            </div>
            <div className="flex items-start gap-3 ml-8">
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
