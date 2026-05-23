import React, { useState } from 'react';
import { Sparkles, LogIn, Target, Cpu, Globe, Award, Shield } from 'lucide-react';
import DocsPageHeader from '../components/DocsPageHeader';
import { TabGroup } from '../components/DocsUI';

const CHAPTERS = [
  { id: 'intro', label: 'Philosophy' },
  { id: 'onboarding', label: 'Onboarding' },
  { id: 'hunter', label: 'Niche Hunter' },
  { id: 'writer', label: 'AI Writer' },
  { id: 'tistory', label: 'Tistory Link' },
  { id: 'flowchart', label: 'Flowchart' },
  { id: 'safety', label: 'Safety' }
];

export default function Guide() {
  const [activeChapter, setActiveChapter] = useState('intro');

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-32 px-8">
      <DocsPageHeader
        badge="수익화 마스터리"
        title="Maza Mastery"
        description="애드센스 승인부터 수익 자동화까지, 필요한 모든 전술을 확인하세요."
      />

      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex justify-center overflow-x-auto pb-4 border-b border-slate-200">
          <TabGroup 
            tabs={CHAPTERS} 
            active={activeChapter} 
            onChange={setActiveChapter} 
          />
        </div>

        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-slate-200 min-h-[400px]">
          {activeChapter === 'intro' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase"><Sparkles size={14}/> Overview</div>
              <h2 className="text-4xl font-black italic text-slate-900 tracking-tighter">WHY Autopilot?</h2>
              <p className="text-slate-600 font-medium leading-relaxed max-w-3xl">
                단순히 글을 쓰는 AI가 아닙니다. 검증된 데이터와 EEAT(경험, 전문성, 권위, 신뢰) 알고리즘을 결합하여, 수익화에 특화된 24시간 블로그 공장을 구축합니다.
              </p>
            </div>
          )}

          {activeChapter === 'onboarding' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase"><LogIn size={14}/> Step 01</div>
              <h2 className="text-4xl font-black italic text-slate-900 tracking-tighter">로그인 및 온보딩</h2>
              <div className="grid md:grid-cols-2 gap-6 pt-4">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h4 className="font-black text-slate-800 mb-2">가입 계정 (로그인용)</h4>
                  <p className="text-sm text-slate-500 font-medium">대시보드 접속을 위한 본인 명의의 주 계정을 사용하세요.</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h4 className="font-black text-slate-800 mb-2">인프라 계정 (수익 전용)</h4>
                  <p className="text-sm text-slate-500 font-medium">실제 블로그 개설 및 애드센스를 운영할 부계정을 분리하여 리스크를 방어하세요.</p>
                </div>
              </div>
            </div>
          )}

          {activeChapter === 'hunter' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase"><Target size={14}/> Step 02</div>
              <h2 className="text-4xl font-black italic text-slate-900 tracking-tighter">니치 헌터 전략</h2>
              <p className="text-slate-600 font-medium leading-relaxed">
                검증된 수익성 주제 20여 종(블루프린트)을 활용해 타겟 키워드를 손쉽게 확보하세요.
              </p>
              <ul className="space-y-3 pt-4 list-disc list-inside text-slate-600 font-medium">
                <li>1. 내 사이트 성격에 맞는 블루프린트 선택</li>
                <li>2. 키워드 금고(Vault) 랜덤 셔플로 고유 포스팅 구성</li>
                <li>3. 스케줄러 등록 후 자동 발행 가동</li>
              </ul>
            </div>
          )}

          {activeChapter === 'writer' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-black uppercase"><Cpu size={14}/> Step 03</div>
              <h2 className="text-4xl font-black italic text-slate-900 tracking-tighter">AI 라이터 엔진</h2>
              <p className="text-slate-600 font-medium leading-relaxed">
                단순 텍스트 생성이 아닌, 구글이 좋아하는 E-E-A-T 구조의 Rich-Text 포스팅을 생성합니다.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4">
                {['의도 분석', '목차 설계', '본문 작성', '경험 증명', 'SEO 최적화'].map((step, i) => (
                  <div key={i} className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-amber-500 font-black italic block mb-1">Step {i+1}</span>
                    <span className="text-xs font-bold text-slate-700">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeChapter === 'tistory' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-black uppercase"><Globe size={14}/> Step 04</div>
              <h2 className="text-4xl font-black italic text-slate-900 tracking-tighter">티스토리 연동</h2>
              <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 text-orange-800">
                <h4 className="font-black mb-2">익스텐션 주입 방식 (Extension Injection)</h4>
                <p className="text-sm font-medium">
                  티스토리의 엄격한 API 정책을 우회하기 위해 마자는 크롬 익스텐션을 통한 '화면 주입' 방식을 사용합니다. 반드시 티스토리에 로그인된 상태로 브라우저를 유지해 주세요.
                </p>
              </div>
            </div>
          )}

          {activeChapter === 'flowchart' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-xs font-black uppercase"><Award size={14}/> Step 05</div>
              <h2 className="text-4xl font-black italic text-slate-900 tracking-tighter">애드센스 승인 순서도</h2>
              <div className="space-y-4 pt-4">
                <div className="flex gap-4 p-4 border border-slate-100 rounded-xl">
                  <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-black">1</div>
                  <div>
                    <h5 className="font-black text-slate-800">기초 공사</h5>
                    <p className="text-xs text-slate-500 mt-1">블로그 개설, 익스텐션 설치, RSS 설정</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 border border-slate-100 rounded-xl">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-black">2</div>
                  <div>
                    <h5 className="font-black text-slate-800">권위 형성</h5>
                    <p className="text-xs text-slate-500 mt-1">블루프린트 가동 (3시간 간격), 15개 누적, 서치콘솔 제출</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 border border-slate-100 rounded-xl">
                  <div className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center font-black">3</div>
                  <div>
                    <h5 className="font-black text-slate-800">승인 대기</h5>
                    <p className="text-xs text-slate-500 mt-1">애드센스 검토 요청, 대기 중에도 1일 1포스팅 유지</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeChapter === 'safety' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-black uppercase"><Shield size={14}/> Step 06</div>
              <h2 className="text-4xl font-black italic text-slate-900 tracking-tighter">리스크 제로 가이드</h2>
              <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
                <h4 className="font-black text-rose-800 mb-2">W-05 프로토콜 (안전 쿨타임)</h4>
                <p className="text-sm text-rose-600 font-medium">
                  단기간 대량 발행은 어뷰징으로 간주됩니다. 마자 스튜디오는 포스팅 간 최소 3시간의 쿨타임을 무조건 강제하여 구글의 저품질 필터를 안전하게 우회합니다.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
