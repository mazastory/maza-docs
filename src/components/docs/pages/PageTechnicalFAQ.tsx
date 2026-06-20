import { Search, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: '색인 요청을 해도 검색 결과에 안 뜨는데요?',
    a: '색인 요청 후 검색 결과 반영까지 최소 3~14일이 소요됩니다. 서치콘솔 → URL 검사에서 "URL이 Google에 있음" 상태가 확인되면 정상입니다.',
  },
  {
    q: '사이트맵을 제출했는데 "가져올 수 없음" 오류가 나요',
    a: '블로그가 비공개 상태이거나 서버 응답 오류가 있을 때 발생합니다. 블로그 공개 여부와 사이트맵 URL이 브라우저에서 정상 열리는지 먼저 확인하세요.',
  },
  {
    q: '한글 URL은 어떻게 서치콘솔에 등록하나요?',
    a: '한글 URL은 퍼센트 인코딩된 형태(예: %EC%9D%B4%EB%A0%87%EA%B2%8C)로 입력해야 합니다. 브라우저 주소창의 URL을 그대로 복사하면 자동으로 인코딩된 형태로 복사됩니다.',
  },
  {
    q: 'GA4 데이터가 0으로 표시되는데 연결이 안 된 건가요?',
    a: '연결 직후 48~72시간은 데이터가 집계되지 않을 수 있습니다. GA4 → 관리 → 데이터 스트림에서 "지난 48시간 트래픽 수신 중"이 표시되면 정상입니다.',
  },
  {
    q: '서치콘솔에서 "크롤링 오류"가 많이 보여요',
    a: '존재하지 않는 URL(404)이 크롤링된 경우입니다. 삭제된 글의 URL이라면 무시해도 됩니다. 실제 접근 가능한 URL에서 오류가 나는 경우만 수정이 필요합니다.',
  },
  {
    q: 'RSS 피드와 사이트맵을 둘 다 제출해야 하나요?',
    a: '둘 다 제출하는 것을 강력히 권장합니다. 사이트맵은 전체 글 목록을, RSS는 최신 글 업데이트를 구글에게 알립니다. 두 가지를 함께 사용하면 색인 속도가 크게 향상됩니다.',
  },
];

export default function PageTechnicalFAQ() {
  return (
    <article className="prose-doc">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Search size={11} /> FAQ
        </span>
        <h1 id="technical-faq" className="text-4xl font-black italic tracking-tighter text-slate-900 leading-tight mb-4">
          기술 & SEO FAQ
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          색인, URL, 서치콘솔, GA4 등 기술적인 부분에서 자주 묻는 질문들입니다.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {faqs.map((faq, i) => (
          <div key={i} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="flex items-start gap-3 mb-2">
              <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">Q</span>
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
