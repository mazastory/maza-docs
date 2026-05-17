/**
 * 📊 Real-time SEO Score Panel (Standard RULE-5)
 * 서버측 validator.ts와 동일한 로직을 클라이언트 UI로 구현
 */

import { useMemo } from "react";
import { 
  CheckCircle2, AlertCircle, XCircle, AlignLeft, 
  Link, Image, Hash, Zap, Target, ShieldAlert 
} from "lucide-react";

interface SeoScorePanelProps {
  post: { title: string; blocks: any[]; html?: string; wordCount?: number };
  keyword: string;
}

interface CheckItem {
  label: string;
  icon: React.ReactNode;
  score: number;
  weight: number;
  status: "pass" | "warn" | "fail";
  tip: string;
}

const YMYL_KEYWORDS = [
  '투자', '주식', '재테크', '의료', '진단', '치료', '법률', '소송',
  '보험', '대출', '금리', '채무', '파산', '백신', '약물', '처방', '비트코인', '코인'
];

function calcScore(checks: CheckItem[]): number {
  return checks.reduce((acc, c) => acc + c.score, 0);
}

function getGrade(score: number) {
  if (score >= 85) return { label: "발행 권장", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" };
  if (score >= 65) return { label: "보완 권장", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" };
  return { label: "재생성 권장", color: "text-red-500", bg: "bg-red-50 border-red-200" };
}

function StatusIcon({ status }: { status: CheckItem["status"] }) {
  if (status === "pass") return <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />;
  if (status === "warn") return <AlertCircle  className="w-4 h-4 text-amber-500 flex-shrink-0" />;
  return                        <XCircle      className="w-4 h-4 text-red-400 flex-shrink-0" />;
}

export default function SeoScorePanel({ post, keyword }: SeoScorePanelProps) {
  const checks = useMemo<CheckItem[]>(() => {
    if (!post) return [];
    const { title = "", blocks = [], html = "" } = post;
    const kw = keyword.trim().toLowerCase();

    // 텍스트 통합
    const textBlocks = blocks.filter(b =>
      ["paragraph", "intro", "experience", "insight", "summary", "conclusion"].includes(b.type)
    );
    const allTextContent = textBlocks.map(b => b.text || "").join(" ");
    const fullText = (title + " " + allTextContent + " " + html).replace(/\s+/g, '');
    const charCount = fullText.length;

    // 1. 제목 키워드 (20점)
    const titleHasKw = kw && title.toLowerCase().includes(kw);

    // 2. 글자 수 (20점) - 1,500자 기준
    let wordScore = 0;
    if (charCount >= 1500) wordScore = 20;
    else if (charCount >= 1000) wordScore = 12;
    else if (charCount >= 500) wordScore = 6;

    // 3. H2/H3 (15점)
    const h23Count = blocks.filter(b => b.type === "heading").length + (html.match(/<h2|<h3/gi) || []).length;

    // 4. 이미지 (15점)
    const imgCount = blocks.filter(b => b.type === "image" || b.type === "img").length + (html.match(/<img/gi) || []).length;

    // 5. 내부 링크 (10점)
    const hasLink = blocks.some(b => b.type === "links" || b.type === "link") || (html.match(/<a\s/gi) || []).length > 0;

    // 6. 메타 요약 (10점)
    const firstP = textBlocks[0]?.text || "";
    const hasMeta = firstP.length >= 100;

    // 7. YMYL 리스크 (10점)
    const riskWords = YMYL_KEYWORDS.filter(w => (title + allTextContent).includes(w));
    const isRiskFree = riskWords.length < 3;

    return [
      {
        label: "제목 키워드",
        icon: <Target className="w-4 h-4" />,
        score: titleHasKw ? 20 : 0,
        weight: 20,
        status: titleHasKw ? "pass" : "fail",
        tip: titleHasKw ? "키워드가 제목에 잘 배치되었습니다." : "제목에 핵심 키워드를 포함하세요.",
      },
      {
        label: "본문 글자 수",
        icon: <AlignLeft className="w-4 h-4" />,
        score: wordScore,
        weight: 20,
        status: charCount >= 1500 ? "pass" : charCount >= 800 ? "warn" : "fail",
        tip: `현재 ${charCount.toLocaleString()}자. 1,500자 이상을 권장합니다.`,
      },
      {
        label: "소제목 구조",
        icon: <Hash className="w-4 h-4" />,
        score: h23Count >= 2 ? 15 : (h23Count >= 1 ? 7 : 0),
        weight: 15,
        status: h23Count >= 2 ? "pass" : "fail",
        tip: "H2, H3 태그를 2개 이상 사용하여 구조화하세요.",
      },
      {
        label: "이미지 포함",
        icon: <Image className="w-4 h-4" />,
        score: imgCount >= 1 ? 15 : 0,
        weight: 15,
        status: imgCount >= 1 ? "pass" : "fail",
        tip: "글의 신뢰도를 위해 최소 1장의 이미지가 필요합니다.",
      },
      {
        label: "내부 링크",
        icon: <Link className="w-4 h-4" />,
        score: hasLink ? 10 : 0,
        weight: 10,
        status: hasLink ? "pass" : "fail",
        tip: "다른 포스팅으로 연결되는 링크를 추가하세요.",
      },
      {
        label: "서론 요약 (Meta)",
        icon: <Zap className="w-4 h-4" />,
        score: hasMeta ? 10 : 0,
        weight: 10,
        status: hasMeta ? "pass" : "warn",
        tip: "첫 문단에 100자 이상의 요약 서론을 배치하세요.",
      },
      {
        label: "YMYL 리스크",
        icon: <ShieldAlert className="w-4 h-4" />,
        score: isRiskFree ? 10 : 0,
        weight: 10,
        status: isRiskFree ? "pass" : "warn",
        tip: isRiskFree ? "정책 위반 위험이 낮습니다." : "고위험 키워드(돈/의료)가 발견되었습니다.",
      },
    ];
  }, [post, keyword]);

  const totalScore = calcScore(checks);
  const grade = getGrade(totalScore);

  // SVG 원형 게이지
  const r = 40;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - totalScore / 100);
  const gaugeColor = totalScore >= 85 ? "#10b981" : totalScore >= 65 ? "#f59e0b" : "#f87171";

  return (
    <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-2xl shadow-slate-200/50">
      <div className="px-6 pt-6 pb-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-600 rounded-lg text-white"><Zap size={14} /></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Auto SEO Audit</span>
        </div>
        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${grade.color} ${grade.bg}`}>
          {grade.label}
        </span>
      </div>

      <div className="flex flex-col items-center py-8 gap-3">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r={r} stroke="#f1f5f9" strokeWidth="10" fill="none" />
            <circle
              cx="48" cy="48" r={r}
              stroke={gaugeColor} strokeWidth="10" fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black tracking-tighter" style={{ color: gaugeColor }}>{totalScore}</span>
            <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Points</span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 space-y-2.5">
        {checks.map((check) => (
          <div key={check.label} className="group rounded-2xl p-4 bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all border border-transparent hover:border-slate-100">
            <div className="flex items-center gap-4">
              <StatusIcon status={check.status} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{check.icon}</span>
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{check.label}</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400">{check.score} / {check.weight}</span>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      check.status === "pass" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" :
                      check.status === "warn" ? "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.4)]" : "bg-red-400"
                    }`}
                    style={{ width: `${(check.score / check.weight) * 100}%` }}
                  />
                </div>
                <div className="mt-2 text-[10px] text-slate-500 font-medium leading-relaxed hidden group-hover:block animate-fade-in">
                  {check.tip}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`mx-6 mb-6 p-4 rounded-2xl text-center border ${grade.bg}`}>
        <p className={`text-xs font-black ${grade.color}`}>
          {totalScore >= 85 ? "🏆 구글 애드센스 승인 조건 충족!" : "🔧 승인을 위해 몇 가지 보완이 필요합니다."}
        </p>
      </div>
    </div>
  );
}
