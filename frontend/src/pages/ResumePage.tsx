import { FileText, GraduationCap, PenLine, Sparkles } from 'lucide-react';

const resumeSections = [
  { title: '학업 역량', body: '전공필수 이수와 프로젝트 과목 성과를 기반으로 문제 해결 역량을 강조합니다.' },
  { title: '프로젝트 경험', body: 'PNU 해커톤 금상 경험을 서비스 기획, 프론트엔드 구현, 협업 경험으로 정리합니다.' },
  { title: '자격증/어학', body: 'SQLD, 정보처리기사, TOEIC 870, OPIC IH를 직무 관련 준비도로 연결합니다.' },
];

export default function ResumePage() {
  return (
    <div className="flex-1 overflow-y-auto chat-scroll p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <p className="text-xs text-emerald-400 uppercase tracking-wider">AI Resume Builder</p>
          <h2 className="text-2xl font-bold mt-1">이력서 작성</h2>
          <p className="text-sm text-slate-400 mt-2">졸업 예비자의 내 데이터를 바탕으로 직무 맞춤형 이력서 초안을 작성합니다.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <GraduationCap className="w-6 h-6 text-emerald-400 mb-3" />
              <p className="text-sm text-slate-400">지원 직무</p>
              <p className="text-lg font-semibold mt-1">AI 서비스 기획 인턴</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <h3 className="text-lg font-semibold mb-4">사용 데이터</h3>
              <div className="space-y-2">
                {['성적 및 이수 과목', '프로젝트/공모전', '외부/내부 활동', '자격증/어학 성적'].map((item) => (
                  <div key={item} className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-300">{item}</div>
                ))}
              </div>
            </div>
            <button className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-3 text-sm font-semibold text-white flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" /> AI 초안 생성
            </button>
          </aside>

          <section className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" /> 이력서 초안
              </h3>
              <button className="rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-300 hover:border-emerald-600 flex items-center gap-2">
                <PenLine className="w-4 h-4" /> 문장 다듬기
              </button>
            </div>
            <div className="rounded-lg bg-white text-slate-950 p-8 min-h-[540px]">
              <div className="border-b border-slate-200 pb-4">
                <h4 className="text-2xl font-bold">홍길동</h4>
                <p className="text-sm text-slate-500 mt-1">부산대학교 의생명융합공학부 | AI 서비스 기획 인턴 지원</p>
              </div>
              <div className="mt-6 space-y-6">
                {resumeSections.map((section) => (
                  <div key={section.title}>
                    <h5 className="text-base font-bold text-slate-900">{section.title}</h5>
                    <p className="text-sm text-slate-700 mt-2 leading-6">{section.body}</p>
                  </div>
                ))}
                <div>
                  <h5 className="text-base font-bold text-slate-900">자기소개 요약</h5>
                  <p className="text-sm text-slate-700 mt-2 leading-6">
                    학업 데이터와 활동 이력을 기반으로 데이터 분석과 서비스 문제 해결에 관심을 확장해왔습니다. 교내 해커톤과 비교과 활동을 통해 사용자 문제를 정의하고 구현까지 연결하는 경험을 쌓았습니다.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
