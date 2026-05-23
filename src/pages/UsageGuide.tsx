import React, { useState } from 'react';
import { Cpu, FileText, Image, ShieldAlert, Sparkles } from 'lucide-react';
import DocsPageHeader from '../components/DocsPageHeader';
import { TabGroup, StepCard } from '../components/DocsUI';

type UsageCategory = 'autopilot' | 'aiwriter' | 'visionwriter';

const USAGE_DATA = {
  autopilot: {
    title: "오토파일럿 (Autopilot)",
    subtitle: "자율주행 완전 자동 발행",
    desc: "검증된 블루프린트를 통해 24시간 쉬지 않고 안전하게 블로그를 성장시키는 엔진입니다.",
    icon: Cpu,
    steps: [
      { title: "1. 블루프린트 선택", desc: "도서관에서 승인 최적화 공략집을 고릅니다.", badge: "SELECT" },
      { title: "2. 키워드 셔플 & 스케줄링", desc: "단조로움을 막기 위해 키워드 금고를 무작위로 섞고 발행 시리즈를 배차합니다.", badge: "SHUFFLE" },
      { title: "3. W-05 쿨타임 가동", desc: "어뷰징 제재를 막기 위해 최소 3시간 이상의 발행 간격을 강제합니다.", badge: "SCHEDULE" },
    ]
  },
  aiwriter: {
    title: "AI 라이터 (AI Writer)",
    subtitle: "초고품질 집필 엔진",
    desc: "검색 엔진이 열광하는 최적의 Rich-Text 포스팅을 실시간으로 집필합니다.",
    icon: FileText,
    steps: [
      { title: "1. 목차 구조 설계", desc: "상위 노출 문서를 기반으로 H2, H3가 유기적으로 조합된 목차를 짭니다.", badge: "OUTLINE" },
      { title: "2. 실시간 집필 모니터링", desc: "관제탑에서 AI가 써내려가는 서사를 지켜보며 수정할 수 있습니다.", badge: "STREAMING" },
      { title: "3. SEO 점수 검증", desc: "검증이 완료된 고품질 포스팅을 버튼 클릭 한 번으로 서식 유지 상태로 복사합니다.", badge: "COPY" },
    ]
  },
  visionwriter: {
    title: "비전 스냅블로그",
    subtitle: "경험 기반 인증",
    desc: "직접 촬영한 일상 사진을 활용해 E-E-A-T 점수를 극대화합니다.",
    icon: Image,
    steps: [
      { title: "1. 실제 사진 업로드", desc: "일상에서 찍은 생생한 현장 사진을 서버에 업로드합니다.", badge: "UPLOAD" },
      { title: "2. 메타데이터 세탁", desc: "개인 정보와 민감한 GPS 정보를 모두 제거하고 기기 정보만 남깁니다.", badge: "SCRUB" },
      { title: "3. 경험 인증 인장", desc: "직접 경험했음을 증명하는 배지와 토큰이 삽입되어 신뢰도를 대폭 올립니다.", badge: "SEAL" },
    ]
  }
};

export default function UsageGuide() {
  const [activeTab, setActiveTab] = useState<UsageCategory>('autopilot');
  const activeData = USAGE_DATA[activeTab];

  const tabs = Object.entries(USAGE_DATA).map(([id, data]) => ({
    id,
    label: data.title.split(' ')[0],
    icon: <data.icon size={14} />
  }));

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-32 px-8">
      <DocsPageHeader
        badge="기능 사용 가이드"
        title="핵심 기능 설명서"
        description="마자 스튜디오의 주요 모듈을 빠르게 활용하는 실전 가이드를 제공합니다."
      />

      <div className="max-w-5xl mx-auto space-y-12">
        <div className="flex justify-center border-b border-slate-200 pb-4">
          <TabGroup 
            tabs={tabs} 
            active={activeTab} 
            onChange={(id) => setActiveTab(id as UsageCategory)} 
          />
        </div>

        <div className="space-y-8 animate-in fade-in">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-black uppercase mb-4">
              <Sparkles size={14}/> {activeData.subtitle}
            </div>
            <h2 className="text-3xl font-black italic tracking-tighter text-slate-900 mb-2">
              {activeData.title}
            </h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              {activeData.desc}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-4">
            {activeData.steps.map((step, i) => (
              <StepCard
                key={i}
                number={i + 1}
                title={step.title}
                description={step.desc}
                badge={step.badge}
              />
            ))}
          </div>
          
          <div className="mt-12 bg-amber-50 p-6 rounded-2xl border border-amber-100 flex items-start gap-4">
            <ShieldAlert size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-black text-amber-900 text-sm mb-1">수익화 골든 룰 (Monetization Rule)</h5>
              <p className="text-xs text-amber-800/80 font-medium leading-relaxed">
                자동 발행된 글은 서치콘솔 색인 여부를 매일 확인하며, 애드센스 광고 효율을 극대화할 수 있도록 코드를 최적의 위치에 배치하세요.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
