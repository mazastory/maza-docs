import React, { useState } from 'react';
import { 
  Puzzle, LayoutTemplate, Globe, Server, Box, Download, Copy, ExternalLink, ArrowRight 
} from 'lucide-react';
import { TabGroup, StepCard } from '../components/DocsUI';
import DocsPageHeader from '../components/DocsPageHeader';

type GuideCategory = 'extension' | 'tistory' | 'wordpress' | 'blogspot' | 'subdomain';

const GUIDE_DATA = {
  extension: {
    title: "익스텐션 연동",
    subtitle: "Maza Bridge 설치 가이드",
    icon: Puzzle,
    steps: [
      { title: "1. 파일 다운로드", desc: "maza-extension.zip 파일을 다운로드하고 바탕화면에 저장합니다.", badge: "DOWNLOAD" },
      { title: "2. 압축 해제", desc: "zip 파일의 압축을 해제합니다. 폴더 내에 manifest.json 파일이 있어야 합니다.", badge: "EXTRACT" },
      { title: "3. 확장 프로그램 관리", desc: "주소창에 chrome://extensions 를 입력하여 이동합니다.", badge: "CHROME" },
      { title: "4. 개발자 모드 ON", desc: "우측 상단의 '개발자 모드' 스위치를 켭니다.", badge: "DEV MODE" },
      { title: "5. 폴더 로드", desc: "'압축해제된 확장 프로그램을 로드합니다' 버튼을 클릭하고 폴더를 선택합니다.", badge: "LOAD" },
      { title: "6. 핀 고정", desc: "주소창 우측 퍼즐 아이콘을 눌러 'Maza Bridge'를 상단 바에 고정합니다.", badge: "PIN" },
    ]
  },
  tistory: {
    title: "티스토리 세팅",
    subtitle: "RPA 자동 발행 설정",
    icon: LayoutTemplate,
    steps: [
      { title: "1. 블로그 설정", desc: "티스토리 관리자의 '관리' -> '블로그' 메뉴로 이동합니다.", badge: "SETTINGS" },
      { title: "2. 포스트 주소 숫자 설정", desc: "주소 설정에서 포스트 주소를 [숫자]로 변경하고 저장합니다.", badge: "URL" },
      { title: "3. 스킨 편집 모드 확인", desc: "'꾸미기' -> '스킨 편집'을 눌러 편집기가 열리는지 확인합니다.", badge: "SKIN" },
    ]
  },
  wordpress: {
    title: "워드프레스 세팅",
    subtitle: "REST API 연동",
    icon: Globe,
    steps: [
      { title: "1. 프로필 진입", desc: "WP-Admin 우측 상단의 프로필 이미지를 누르고 '프로필 편집'을 클릭합니다.", badge: "PROFILE" },
      { title: "2. 어플리케이션 비밀번호", desc: "스크롤을 내려 '새로운 어플리케이션 비밀번호 이름'에 임의의 이름을 입력하고 생성합니다.", badge: "GENERATE" },
      { title: "3. 비밀번호 연동", desc: "발급된 24자리 비밀번호를 복사하여 마자스튜디오 워드프레스 설정에 붙여넣습니다.", badge: "CONNECT" },
    ]
  },
  blogspot: {
    title: "블로그스팟 세팅",
    subtitle: "Google OAuth 간편 연동",
    icon: Server,
    steps: [
      { title: "1. My Site 접속", desc: "마자스튜디오 좌측 사이드바 'My Site'에서 블로그스팟 연동 버튼을 클릭합니다.", badge: "START" },
      { title: "2. 구글 로그인", desc: "블로그스팟을 운영 중인 계정으로 로그인하고 권한을 허용합니다.", badge: "OAUTH" },
      { title: "3. 블로그 선택", desc: "연결할 타겟 블로그스팟 URL을 지정합니다.", badge: "TARGET" },
    ]
  },
  subdomain: {
    title: "서브도메인 개설",
    subtitle: "Maza 원클릭 블로그",
    icon: Box,
    steps: [
      { title: "원클릭 개설 (오픈 예정)", desc: "도메인, 호스팅, 세팅이 한 번에 완료되는 서브도메인 서비스가 곧 출시됩니다.", badge: "COMING SOON" },
    ]
  }
};

export default function InstallationGuide() {
  const [activeTab, setActiveTab] = useState<GuideCategory>('extension');
  const activeData = GUIDE_DATA[activeTab];

  const tabs = Object.entries(GUIDE_DATA).map(([id, data]) => ({
    id,
    label: data.title,
    icon: <data.icon size={14} />
  }));

  return (
    <div className="min-h-screen bg-[#F9F9F8] pt-24 pb-32 px-8">
      <DocsPageHeader
        badge="설치 및 연동 가이드"
        title="인프라 세팅 가이드"
        description="복잡한 세팅 과정 없이, 안내에 따라 각 플랫폼을 1분 만에 연동하세요."
      />

      <div className="max-w-5xl mx-auto space-y-12">
        <div className="flex justify-center border-b border-slate-200 pb-4">
          <TabGroup tabs={tabs} active={activeTab} onChange={(id) => setActiveTab(id as GuideCategory)} />
        </div>

        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black italic tracking-tighter text-slate-900">{activeData.title}</h2>
            <p className="text-slate-500 font-bold">{activeData.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeData.steps.map((step, idx) => (
              <StepCard
                key={idx}
                number={idx + 1}
                title={step.title}
                description={step.desc}
                badge={step.badge}
              />
            ))}
          </div>

          {activeTab === 'extension' && (
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <a 
                href="/maza-extension.zip"
                download
                className="flex-1 p-5 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Download size={16} /> 익스텐션 다운로드
              </a>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText('chrome://extensions');
                  alert('주소가 복사되었습니다. 새 탭에 붙여넣으세요.');
                }}
                className="flex-1 p-5 bg-white text-slate-800 border border-slate-200 hover:border-indigo-600 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Copy size={16} /> chrome://extensions 복사
              </button>
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6 pt-16 border-t border-slate-200">
          <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black italic tracking-tighter uppercase mb-2">원격 지원 센터</h3>
            <p className="text-[11px] text-slate-500 font-bold leading-relaxed mb-6">설치 과정에서 오류가 발생한다면 라이브 지원을 요청하세요.</p>
            <button className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase flex items-center gap-2 w-full justify-center">
              <ExternalLink size={14} /> 지원 요청하기
            </button>
          </div>
          <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black italic tracking-tighter uppercase mb-2">자주 묻는 질문</h3>
            <p className="text-[11px] text-slate-500 font-bold leading-relaxed mb-6">FAQ에서 연동 관련 문제 해결 방법을 찾아보세요.</p>
            <button onClick={() => window.location.href = '/faq'} className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 w-full justify-center">
              <ArrowRight size={14} /> FAQ 바로가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
