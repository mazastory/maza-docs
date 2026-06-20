import { Image, Camera, Star, CheckCircle, AlertTriangle } from 'lucide-react';

export default function PageVisionWriter() {
  return (
    <article className="prose-doc">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Image size={11} /> Feature
        </span>
        <h1 id="visionwriter" className="text-4xl font-black italic tracking-tighter text-slate-900 leading-tight mb-4">
          비전 라이터
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          <strong className="text-slate-900">Vision Writer</strong>는 실제 사진을 AI에게 보여주고,
          그 경험을 기반으로 글을 작성하는 기능입니다. E-E-A-T의 핵심인 '경험(Experience)'을 극대화합니다.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="p-7 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <h4 className="text-base font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <span className="text-2xl">😩</span> 기존 AI 글의 문제
          </h4>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            AI가 만들어낸 상상 속 경험은 구글이 쉽게 탐지합니다. 실제 경험 없는 글은 신뢰도가 낮아 상위 노출이 어렵습니다.
          </p>
        </div>
        <div className="p-7 bg-indigo-600 rounded-2xl text-white space-y-3 shadow-xl shadow-indigo-200">
          <h4 className="text-base font-black uppercase tracking-tight flex items-center gap-2">
            <span className="text-2xl">📸</span> Vision Writer의 해결책
          </h4>
          <p className="text-sm font-medium leading-relaxed opacity-90">
            실제 사진을 첨부하면 AI가 그 사진 속 경험을 분석하여 진짜 체험 기반의 스토리를 작성합니다.
          </p>
        </div>
      </div>

      <h2 id="how-to-use" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        사용 방법
      </h2>
      <div className="space-y-4 mb-10">
        {[
          { step: '01', title: '사진 촬영 또는 선택', desc: '블로그에 쓸 내용과 관련된 실제 경험 사진을 스마트폰이나 카메라로 촬영합니다. 음식, 여행, 제품 사용, 장소 방문 등 어떤 사진이든 가능합니다.' },
          { step: '02', title: '비전 라이터 접속', desc: '마자 스튜디오 → 오토파일럿 → [비전 라이터] 탭을 선택합니다.' },
          { step: '03', title: '사진 업로드 & 키워드 입력', desc: '촬영한 사진을 드래그 앤 드롭으로 업로드하고, 타겟 키워드를 입력합니다.' },
          { step: '04', title: '글 생성', desc: 'AI가 사진을 분석하여 경험 기반의 스토리텔링 형식으로 글을 작성합니다. 생성된 글에는 업로드한 사진이 자동으로 삽입됩니다.' },
        ].map((item) => (
          <div key={item.step} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shrink-0 bg-emerald-100 text-emerald-700">
              {item.step}
            </div>
            <div>
              <p className="text-sm font-black text-slate-800 mb-1">{item.title}</p>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 id="best-photos" className="text-2xl font-black tracking-tight text-slate-900 mb-4 pb-3 border-b border-slate-100">
        효과적인 사진 유형
      </h2>
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        <div className="space-y-2">
          <p className="text-xs font-black text-emerald-700 uppercase tracking-wide mb-3">✅ 권장</p>
          {[
            '음식 직접 촬영 사진 (맛집 리뷰)',
            '직접 방문한 장소 사진 (여행 후기)',
            '실제 구매 제품 언박싱 사진',
            '시술·서비스 이전/이후 비교 사진',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
              <CheckCircle size={12} className="text-emerald-500 shrink-0" /> {item}
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-xs font-black text-rose-700 uppercase tracking-wide mb-3">❌ 비권장</p>
          {[
            '인터넷에서 다운받은 이미지',
            'AI로 생성된 이미지',
            '저작권이 명시된 타인의 사진',
            '품질이 매우 낮은 블러 이미지',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <AlertTriangle size={12} className="text-rose-400 shrink-0" /> {item}
            </div>
          ))}
        </div>
      </div>

      <div className="p-5 bg-amber-50 border border-amber-100 rounded-2xl">
        <p className="text-sm font-black text-amber-800 flex items-center gap-2 mb-1"><Star size={14} /> 왜 실제 사진이 중요한가요?</p>
        <p className="text-xs text-amber-700 font-medium leading-relaxed">
          구글의 E-E-A-T 알고리즘은 '직접 경험한 흔적'을 높이 평가합니다. 실제 사진이 포함된 글은 AI 탐지에서도 자유롭고, 독자의 신뢰도와 체류 시간이 크게 향상되어 SEO에 직결됩니다.
        </p>
      </div>
    </article>
  );
}
