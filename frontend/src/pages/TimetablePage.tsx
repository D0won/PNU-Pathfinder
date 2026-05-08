import { useState } from 'react';
import { ChevronDown, ChevronUp, Clock3, ListChecks, Plus, Sparkles } from 'lucide-react';

const days = ['월', '화', '수', '목', '금'];
const times = ['09', '10', '11', '12', '13', '14', '15', '16'];

type Lecture = {
  id: string;
  day: number;
  start: number;
  span: number;
  name: string;
  type: string;
  credits: number;
  professor: string;
  color: string;
};

type Timetable = {
  id: string;
  title: string;
  label: string;
  lectures: Lecture[];
};

type CatalogCourse = Lecture & {
  college: string;
  department: string;
  major: string;
  time: string;
};

const initialTimetables: Timetable[] = [
  {
    id: 'a',
    title: '시간표 A',
    label: '졸업요건 충족 우선',
    lectures: [
      { id: 'bio-intro', day: 0, start: 1, span: 2, name: '첨단바이오공학입문', type: '전공필수', credits: 3, professor: '김교수', color: 'bg-emerald-600/80' },
      { id: 'bio-info', day: 1, start: 3, span: 2, name: '생명정보학개론', type: '전공필수', credits: 3, professor: '이교수', color: 'bg-blue-600/80' },
      { id: 'ai-basic', day: 2, start: 0, span: 2, name: 'AI개론', type: '전공선택', credits: 3, professor: '박교수', color: 'bg-purple-600/80' },
      { id: 'hyo-core', day: 3, start: 5, span: 2, name: '효원교양', type: '교양선택', credits: 2, professor: '최교수', color: 'bg-amber-600/80' },
    ],
  },
];

const catalogCourses: CatalogCourse[] = [
  { id: 'bio-data', college: '나노과학기술대학', department: '의생명융합공학부', major: '첨단바이오공학전공', day: 4, start: 2, span: 2, name: '바이오데이터분석', type: '전공선택', credits: 3, professor: '정교수', color: 'bg-teal-600/80', time: '금 11:00-13:00' },
  { id: 'molecular', college: '나노과학기술대학', department: '의생명융합공학부', major: '첨단바이오공학전공', day: 2, start: 4, span: 2, name: '분자생물학', type: '전공필수', credits: 3, professor: '한교수', color: 'bg-rose-600/80', time: '수 13:00-15:00' },
  { id: 'bio-ai', college: '나노과학기술대학', department: '의생명융합공학부', major: '첨단바이오공학전공', day: 4, start: 5, span: 2, name: '바이오인공지능응용', type: '전공선택', credits: 3, professor: '오교수', color: 'bg-indigo-600/80', time: '금 14:00-16:00' },
  { id: 'data-basic', college: '정보의생명공학대학', department: '데이터사이언스융합전공', major: '데이터사이언스', day: 0, start: 5, span: 2, name: '데이터사이언스기초', type: '부전공', credits: 3, professor: '문교수', color: 'bg-cyan-600/80', time: '월 14:00-16:00' },
];

const colleges = Array.from(new Set(catalogCourses.map((course) => course.college)));

export default function TimetablePage() {
  const [timetables, setTimetables] = useState(initialTimetables);
  const [activeTimetableId, setActiveTimetableId] = useState(initialTimetables[0].id);
  const [expandedTimetableId, setExpandedTimetableId] = useState<string | null>(initialTimetables[0].id);
  const [selectedCollege, setSelectedCollege] = useState(colleges[0]);
  const departments = Array.from(new Set(catalogCourses.filter((course) => course.college === selectedCollege).map((course) => course.department)));
  const [selectedDepartment, setSelectedDepartment] = useState(departments[0]);
  const majors = Array.from(new Set(catalogCourses.filter((course) => course.college === selectedCollege && course.department === selectedDepartment).map((course) => course.major)));
  const [selectedMajor, setSelectedMajor] = useState(majors[0]);

  const visibleCourses = catalogCourses.filter((course) => (
    course.college === selectedCollege && course.department === selectedDepartment && course.major === selectedMajor
  ));

  function addTimetable() {
    const nextNumber = timetables.length + 1;
    const nextId = `custom-${nextNumber}`;
    setTimetables((current) => [
      ...current,
      {
        id: nextId,
        title: `시간표 ${String.fromCharCode(64 + nextNumber)}`,
        label: '직접 구성',
        lectures: [],
      },
    ]);
    setActiveTimetableId(nextId);
    setExpandedTimetableId(nextId);
  }

  function addCourseToTimetable(course: CatalogCourse) {
    setTimetables((current) => current.map((timetable) => {
      if (timetable.id !== activeTimetableId) return timetable;
      if (timetable.lectures.some((lecture) => lecture.id === course.id)) return timetable;
      return { ...timetable, lectures: [...timetable.lectures, course] };
    }));
    setExpandedTimetableId(activeTimetableId);
  }

  function handleCollegeChange(value: string) {
    const nextDepartments = Array.from(new Set(catalogCourses.filter((course) => course.college === value).map((course) => course.department)));
    const nextDepartment = nextDepartments[0];
    const nextMajors = Array.from(new Set(catalogCourses.filter((course) => course.college === value && course.department === nextDepartment).map((course) => course.major)));
    setSelectedCollege(value);
    setSelectedDepartment(nextDepartment);
    setSelectedMajor(nextMajors[0]);
  }

  function handleDepartmentChange(value: string) {
    const nextMajors = Array.from(new Set(catalogCourses.filter((course) => course.college === selectedCollege && course.department === value).map((course) => course.major)));
    setSelectedDepartment(value);
    setSelectedMajor(nextMajors[0]);
  }

  return (
    <div className="flex-1 overflow-y-auto chat-scroll p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <p className="text-xs text-emerald-400 uppercase tracking-wider">Course Registration Assistant</p>
          <h2 className="text-2xl font-bold mt-1">AI 시간표 설계</h2>
          <p className="text-sm text-slate-400 mt-2">수강신청 기간에 수강편람 데이터를 기반으로 시간표를 추천하고 대화로 조정합니다.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
          <section className="space-y-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Clock3 className="w-5 h-5 text-emerald-400" /> 시간표 목록
                </h3>
                <button className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-2 text-sm font-semibold text-white flex items-center gap-2" onClick={addTimetable}>
                  <Plus className="w-4 h-4" /> 시간표 추가
                </button>
              </div>

              <div className="space-y-3">
                {timetables.map((timetable) => {
                  const isExpanded = expandedTimetableId === timetable.id;
                  const isActive = activeTimetableId === timetable.id;

                  return (
                    <div key={timetable.id} className={`rounded-xl border ${isActive ? 'border-emerald-600' : 'border-slate-700'} bg-slate-900/60 overflow-hidden`}>
                      <button
                        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
                        onClick={() => {
                          setActiveTimetableId(timetable.id);
                          setExpandedTimetableId((current) => current === timetable.id ? null : timetable.id);
                        }}
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-100">{timetable.title}</p>
                          <p className="text-xs text-slate-500 mt-1">{timetable.label} · {timetable.lectures.reduce((sum, lecture) => sum + lecture.credits, 0)}학점</p>
                        </div>
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                      </button>

                      {isExpanded && (
                        <div className="border-t border-slate-700 p-4">
                          <TimetableGrid lectures={timetable.lectures} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <h3 className="text-lg font-semibold mb-4">수강편람 과목 선택</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <SelectBox label="단과대학" value={selectedCollege} options={colleges} onChange={handleCollegeChange} />
                <SelectBox label="학과/학부" value={selectedDepartment} options={departments} onChange={handleDepartmentChange} />
                <SelectBox label="전공" value={selectedMajor} options={majors} onChange={setSelectedMajor} />
              </div>
              <div className="overflow-hidden rounded-lg border border-slate-700">
                <table className="w-full table-fixed text-sm">
                  <colgroup>
                    <col className="w-24" />
                    <col />
                    <col className="w-20" />
                    <col className="w-28" />
                    <col className="w-20" />
                    <col className="w-20" />
                  </colgroup>
                  <thead className="bg-slate-950/80 text-xs text-slate-400">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">이수구분</th>
                      <th className="px-3 py-2 text-left font-medium">과목명</th>
                      <th className="px-3 py-2 text-right font-medium">학점</th>
                      <th className="px-3 py-2 text-left font-medium">시간</th>
                      <th className="px-3 py-2 text-left font-medium">교수</th>
                      <th className="px-3 py-2 text-right font-medium">추가</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700 bg-slate-950/40">
                    {visibleCourses.map((course) => (
                      <tr key={course.id}>
                        <td className="px-3 py-3 text-emerald-300">{course.type}</td>
                        <td className="px-3 py-3 text-slate-200">{course.name}</td>
                        <td className="px-3 py-3 text-right text-slate-300">{course.credits}</td>
                        <td className="px-3 py-3 text-slate-400">{course.time}</td>
                        <td className="px-3 py-3 text-slate-400">{course.professor}</td>
                        <td className="px-3 py-3 text-right">
                          <button className="rounded-md bg-slate-800 px-2 py-1 text-xs text-emerald-300 hover:bg-emerald-950" onClick={() => addCourseToTimetable(course)}>
                            추가
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-emerald-400" /> LLM 시간표 조정
              </h3>
              <div className="space-y-2">
                {['금요일 공강으로 다시 짜줘', '오전 수업을 줄여줘', '전공필수를 더 우선해줘', '재수강 과목을 포함해줘'].map((item) => (
                  <button key={item} className="w-full text-left rounded-lg bg-slate-900 border border-slate-700 px-3 py-3 text-sm text-slate-300 hover:border-emerald-600">{item}</button>
                ))}
              </div>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <ListChecks className="w-5 h-5 text-emerald-400" /> 반영 조건
              </h3>
              <div className="space-y-3 text-sm">
                <p className="flex justify-between"><span className="text-slate-400">전공필수</span><span className="text-emerald-400">2과목 포함</span></p>
                <p className="flex justify-between"><span className="text-slate-400">최대 학점</span><span className="text-slate-200">18학점</span></p>
                <p className="flex justify-between"><span className="text-slate-400">공강 선호</span><span className="text-slate-200">금요일</span></p>
                <p className="flex justify-between"><span className="text-slate-400">활성 시간표</span><span className="text-blue-300">{timetables.find((timetable) => timetable.id === activeTimetableId)?.title}</span></p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

interface SelectBoxProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

function SelectBox({ label, value, options, onChange }: SelectBoxProps) {
  return (
    <label className="block">
      <span className="text-xs text-slate-500">{label}</span>
      <select className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 outline-none focus:border-emerald-500" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function TimetableGrid({ lectures }: { lectures: Lecture[] }) {
  return (
    <div className="grid grid-cols-[48px_repeat(5,minmax(0,1fr))] overflow-hidden rounded-lg border border-slate-700">
      <div className="bg-slate-900 p-2" />
      {days.map((day) => <div key={day} className="bg-slate-900 p-2 text-center text-sm font-semibold text-slate-300 border-l border-slate-700">{day}</div>)}
      {times.map((time, row) => (
        <>
          <div key={`${time}-label`} className="min-h-16 bg-slate-900 p-2 text-xs text-slate-500 border-t border-slate-700">{time}:00</div>
          {days.map((day, col) => {
            const lecture = lectures.find((item) => item.day === col && item.start === row);
            const covered = lectures.some((item) => item.day === col && row > item.start && row < item.start + item.span);
            if (covered) return <div key={`${time}-${day}`} className="hidden" />;
            return (
              <div key={`${time}-${day}`} className="relative min-h-16 border-l border-t border-slate-700 bg-slate-950/40">
                {lecture && (
                  <div className={`absolute inset-1 rounded-md ${lecture.color} p-2 text-white`} style={{ height: `calc(${lecture.span * 4}rem - 0.5rem)` }}>
                    <p className="text-xs font-semibold leading-tight">{lecture.name}</p>
                    <p className="text-[11px] opacity-80 mt-1">{lecture.type} · {lecture.credits}학점</p>
                    <p className="text-[11px] opacity-70">{lecture.professor}</p>
                  </div>
                )}
              </div>
            );
          })}
        </>
      ))}
    </div>
  );
}
