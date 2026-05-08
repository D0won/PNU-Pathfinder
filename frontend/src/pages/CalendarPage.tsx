import { CalendarDays, CheckCircle2 } from 'lucide-react';

const calendarDays = Array.from({ length: 35 }, (_, index) => index + 1);
const events = [
  { day: 3, label: '수강정정', color: 'bg-emerald-600' },
  { day: 8, label: '학과 특강', color: 'bg-blue-600' },
  { day: 14, label: 'SQLD 접수', color: 'bg-amber-600' },
  { day: 21, label: '인턴 마감', color: 'bg-purple-600' },
  { day: 27, label: '비교과', color: 'bg-teal-600' },
];

export default function CalendarPage() {
  return (
    <div className="flex-1 overflow-y-auto chat-scroll p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <p className="text-xs text-emerald-400 uppercase tracking-wider">Personal Academic Calendar</p>
          <h2 className="text-2xl font-bold mt-1">통합 일정 달력</h2>
          <p className="text-sm text-slate-400 mt-2">학사일정, 학과 이벤트, 자격증, 외부/내부 활동 일정을 한 번에 관리합니다.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
          <section className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-emerald-400" /> 2026년 5월
              </h3>
              <div className="flex gap-2 text-xs">
                {['학사', '학과', '자격증', '외부활동'].map((item) => <span key={item} className="rounded-full bg-slate-900 border border-slate-700 px-3 py-1 text-slate-300">{item}</span>)}
              </div>
            </div>
            <div className="grid grid-cols-7 rounded-lg overflow-hidden border border-slate-700">
              {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
                <div key={day} className="bg-slate-900 p-3 text-center text-sm font-semibold text-slate-300 border-b border-slate-700">{day}</div>
              ))}
              {calendarDays.map((day) => {
                const dayEvents = events.filter((event) => event.day === day);
                return (
                  <div key={day} className="min-h-28 bg-slate-950/40 border-t border-l border-slate-800 p-2">
                    <p className="text-xs text-slate-500">{day}</p>
                    <div className="mt-2 space-y-1">
                      {dayEvents.map((event) => (
                        <div key={event.label} className={`rounded px-2 py-1 text-[11px] text-white ${event.color}`}>{event.label}</div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <aside className="space-y-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <h3 className="text-lg font-semibold mb-4">다가오는 일정</h3>
              <div className="space-y-3">
                {events.slice(0, 4).map((event) => (
                  <div key={event.label} className="flex items-center gap-3 rounded-lg bg-slate-900 border border-slate-700 p-3">
                    <div className={`w-2 h-10 rounded-full ${event.color}`} />
                    <div>
                      <p className="text-sm font-medium text-slate-200">5월 {event.day}일</p>
                      <p className="text-xs text-slate-400">{event.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-emerald-950/40 border border-emerald-900 rounded-xl p-5">
              <CheckCircle2 className="w-5 h-5 text-emerald-300 mb-3" />
              <p className="text-sm font-semibold text-emerald-100">AI 일정 추천</p>
              <p className="text-xs text-emerald-300/80 mt-2">SQLD 준비 일정과 인턴 지원 마감일을 학업 부담이 낮은 주차에 배치했습니다.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
