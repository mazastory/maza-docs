import React from 'react';
import { Zap, ShieldCheck, Database, Server, LockOpen, Code2, Globe } from 'lucide-react';

export default function PageZeroITWorkflow() {
  return (
    <article className="prose-doc pb-24">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <Zap size={11} /> Concept
        </span>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight mb-4">
          제로 IT 워크플로우 & 독립성
        </h1>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          코딩이나 서버 지식 없이 버튼 3번만으로 블로그를 구축하고, 언제든지 내 데이터베이스로 독립(Independence)하여 
          플랫폼 종속성(Lock-in) 없이 <strong>영구적으로 블로그를 소유</strong>하는 방법을 알아봅니다.
        </p>
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Zap className="text-amber-500" /> 1초 만에 끝나는 ZeroIT 세팅
        </h2>
        <p className="text-slate-600 mb-6">
          기존의 수동 세팅 과정(소스코드 다운로드 ➡️ 깃허브 업로드 ➡️ 넷리파이 연결)을 모두 생략하고, Maza Studio 내에서 3번의 클릭만으로 나만의 블로그가 완성됩니다.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mx-auto mb-4 text-slate-800">
              <Code2 size={24} />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">1. GitHub 연동</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              버튼 클릭 한 번으로 Maza Blog 소스 코드가 개인 저장소에 자동으로 복사(Fork)됩니다.
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mx-auto mb-4 text-emerald-600">
              <Server size={24} />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">2. Netlify 연동</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              넷리파이 권한 승인 시, 깃허브 코드와 자동 연결되어 배포 파이프라인이 구축됩니다.
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mx-auto mb-4 text-indigo-600">
              <Globe size={24} />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">3. 도메인 연결</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              구매한 도메인을 입력하면 Maza Studio가 서버 호스팅을 시작하며 세팅을 완료합니다.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
            <ShieldCheck size={18} /> 마지막으로 딱 하나만 직접 해주세요!
          </h4>
          <p className="text-sm text-blue-800">
            도메인 구입처(가비아, 호스팅케이알 등)에서 DNS 레코드(A, CNAME)를 Netlify 서버를 향하도록 추가해 주시면 모든 준비가 끝납니다.
          </p>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <LockOpen className="text-rose-500" /> 데이터 종속성 0% (완벽한 독립)
        </h2>
        <p className="text-slate-600 mb-6">
          "구독을 해지하면 내 블로그와 정성껏 작성한 글들이 모두 날아가는 것 아닐까?"<br/>
          이런 불안감을 해소하기 위해 마자 스튜디오는 <strong>완벽한 데이터 소유권 이전 시스템</strong>을 제공합니다.
        </p>

        <div className="space-y-4 mb-8">
          <details className="group bg-white border border-slate-200 rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between p-5 font-bold text-slate-800 cursor-pointer bg-slate-50 group-open:bg-indigo-50 transition-colors">
              Q. 구독을 해지하면 제 블로그와 글들은 모두 삭제되나요?
              <span className="text-indigo-500 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-5 border-t border-slate-100 text-slate-600 text-sm leading-relaxed">
              <strong>전혀 그렇지 않습니다!</strong> 언제든 원클릭으로 고객님의 데이터를 빼내어 개인 데이터베이스(Supabase)로 
              완벽히 독립할 수 있습니다. 구독이 종료되어도 예쁜 마자 블로그 템플릿을 그대로 사용하며 영구적으로 블로그를 소유하실 수 있습니다.
            </div>
          </details>

          <details className="group bg-white border border-slate-200 rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between p-5 font-bold text-slate-800 cursor-pointer bg-slate-50 group-open:bg-indigo-50 transition-colors">
              Q. 이관 후에는 어떻게 글을 쓰나요?
              <span className="text-indigo-500 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-5 border-t border-slate-100 text-slate-600 text-sm leading-relaxed">
              마자 블로그에는 평생 무료로 운영할 수 있는 <strong>전용 수동 마크다운 에디터</strong>가 내장되어 있습니다. 
              독립된 블로그 도메인의 <code>/admin</code> 경로로 접속하시면, Live Preview가 지원되는 대시보드에서 직접 글을 관리할 수 있습니다.
            </div>
          </details>
        </div>

        <div className="bg-slate-800 rounded-xl p-8 text-white">
          <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
            <Database size={20} /> 3단계 블로그 독립 프로세스
          </h3>
          <ol className="space-y-4 list-decimal list-inside text-sm text-slate-300">
            <li><strong className="text-white">무료 DB 생성:</strong> Supabase에 가입하고 무료 프로젝트를 하나 생성합니다.</li>
            <li><strong className="text-white">데이터 백업:</strong> 마자 스튜디오에서 <code>SQL 스키마</code>와 <code>JSON 게시글 데이터</code>를 받아 본인의 DB에 이관합니다.</li>
            <li><strong className="text-white">연결 정보 교체:</strong> Netlify 대시보드 환경변수(Env) 메뉴에서 새 DB 주소와 키값으로 교체하면 완전히 분리됩니다.</li>
          </ol>
        </div>
      </section>
    </article>
  );
}
