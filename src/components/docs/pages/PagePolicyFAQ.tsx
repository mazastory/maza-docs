import { ShieldCheck, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: '마자 스튜디오는 구글 정책을 위반하지 않나요?',
    a: '마자는 자동화 발행 도구이지만, 생성되는 콘텐츠의 품질과 E-E-A-T 기준을 엄격히 준수합니다. 대량 스팸 발행이 아닌 품질 중심의 콘텐츠 자동화를 지향하며, W-05 안전 프로토콜로 발행 간격을 강제합니다.',
  },
  {
    q: '내 구글 계정 정보가 안전한가요?',
    a: '마자 스튜디오는 구글 OAuth 2.0 표준을 사용합니다. 비밀번호를 직접 저장하지 않으며, 사용자가 직접 권한을 부여하고 언제든 취소할 수 있습니다. 구글 계정 보안 설정에서 언제든 마자 스튜디오의 접근을 해제할 수 있습니다.',
  },
  {
    q: '애드센스 계정을 여러 개 운영해도 되나요?',
    a: '안 됩니다. 구글 애드센스는 1인 1계정 정책을 엄격히 적용합니다. 여러 개의 블로그는 하나의 애드센스 계정에 사이트로 추가하는 방식으로 운영하세요.',
  },
  {
    q: 'AI로 생성된 글이 구글 정책에 걸리지 않나요?',
    a: '2023년 2월부터 구글은 "AI 생성 여부"가 아닌 "콘텐츠 품질과 가치"로 평가한다고 공식 발표했습니다. 마자의 AI 라이터는 E-E-A-T 기준을 충족하는 고품질 콘텐츠를 생성하므로 정책 위반에 해당하지 않습니다.',
  },
  {
    q: '개인정보는 어떻게 처리되나요?',
    a: '마자 스튜디오는 서비스 제공에 필요한 최소한의 정보만 수집합니다. 블로그 관련 데이터는 암호화되어 저장되며, 제3자에게 판매하거나 제공하지 않습니다. 자세한 내용은 개인정보처리방침을 확인하세요.',
  },
  {
    q: '구독을 해지하면 데이터는 어떻게 되나요?',
    a: '구독 해지 후 30일간 데이터가 보존됩니다. 30일 내 재구독 시 모든 데이터를 복원할 수 있으며, 30일 경과 후에는 영구 삭제됩니다.',
  },
];

export default function PagePolicyFAQ() {
  return (
    <article className="prose-doc">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <ShieldCheck size={11} /> FAQ
        </span>
        <h1 id="policy-faq" className="text-4xl font-black italic tracking-tighter text-slate-900 leading-tight mb-4">
          정책 & 보안 FAQ
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          마자 스튜디오의 정책 준수, 계정 보안, 개인정보에 관한 자주 묻는 질문들입니다.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {faqs.map((faq, i) => (
          <div key={i} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="flex items-start gap-3 mb-2">
              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">Q</span>
              <p className="text-sm font-black text-slate-800">{faq.q}</p>
            </div>
            <div className="ml-8">
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
