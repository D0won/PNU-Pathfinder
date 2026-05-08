import { useState, type FormEvent } from 'react';
import { BadgeCheck, BookOpen, BriefcaseBusiness, CalendarRange, GraduationCap, Languages, MessageSquareText, Plus, RotateCcw, Save, Send, UserRound } from 'lucide-react';

const initialSemesters = [
  {
    term: '2학년 2학기',
    focus: '전공 기반 다지기',
    credits: '18학점',
    courseSummary: ['전공필수 2건', '전공선택 2건', '교양필수 1건'],
    activitySummary: ['내부활동 1건', '자격증 1건'],
    courses: [
      { category: '전공필수', name: '첨단바이오공학입문', credits: 3 },
      { category: '전공필수', name: '생명정보학개론', credits: 3 },
      { category: '전공선택', name: '데이터사이언스기초', credits: 3 },
      { category: '전공선택', name: '바이오데이터분석', credits: 3 },
      { category: '교양필수', name: '대학영어', credits: 2 },
    ],
    activities: [
      { category: '내부활동', name: 'PNU AI 비교과 000 프로그램', period: '10주' },
      { category: '자격증', name: 'SQLD', period: '8주 준비' },
    ],
  },
  {
    term: '3학년 1학기',
    focus: '진로 방향 좁히기',
    credits: '17학점',
    courseSummary: ['전공필수 1건', '전공선택 3건', '교양선택 1건'],
    activitySummary: ['외부활동 1건', '어학 1건'],
    courses: [
      { category: '전공필수', name: '분자생물학', credits: 3 },
      { category: '전공선택', name: '머신러닝', credits: 3 },
      { category: '전공선택', name: '데이터베이스심화', credits: 3 },
      { category: '전공선택', name: '의생명통계', credits: 3 },
      { category: '교양선택', name: '기술과창업', credits: 2 },
    ],
    activities: [
      { category: '외부활동', name: '데이터 분석 부트캠프 사전반', period: '방학 전 신청' },
      { category: '어학', name: 'OPIC IH 목표', period: '6주 준비' },
    ],
  },
  {
    term: '3학년 여름',
    focus: '실전 경험 확보',
    credits: '방학',
    courseSummary: ['계절학기 후보 1건', '재수강 검토 1건'],
    activitySummary: ['인턴 1건', '포트폴리오 1건'],
    courses: [
      { category: '교양선택', name: '디지털리터러시', credits: 3 },
      { category: '재수강검토', name: '일반화학', credits: 3 },
    ],
    activities: [
      { category: '외부활동', name: '체험형 데이터 인턴십', period: '8주' },
      { category: '포트폴리오', name: '바이오데이터 분석 프로젝트 정리', period: '4주' },
    ],
  },
  {
    term: '4학년 1학기',
    focus: '졸업요건 마무리',
    credits: '15학점',
    courseSummary: ['전공선택 2건', '일반선택 1건', '졸업요건 점검'],
    activitySummary: ['인턴 1건', '이력서 1건'],
    courses: [
      { category: '전공선택', name: '바이오인공지능응용', credits: 3 },
      { category: '전공선택', name: '캡스톤디자인', credits: 3 },
      { category: '일반선택', name: '진로설계와취업전략', credits: 2 },
    ],
    activities: [
      { category: '외부활동', name: 'AI 헬스케어 인턴십', period: '학기 병행' },
      { category: '취업준비', name: 'AI 이력서 초안 작성', period: '2주' },
    ],
  },
];

type SemesterPlan = (typeof initialSemesters)[number];
type CourseField = keyof SemesterPlan['courses'][number];
type ActivityField = keyof SemesterPlan['activities'][number];
type RoadmapSnapshot = {
  id: string;
  name: string;
  semesters: SemesterPlan[];
};

const initialMessages = [
  {
    role: 'assistant',
    text: '로드맵에서 원하는 학기를 펼친 뒤 직접 수정하거나, LLM에게 “3학년 때는 SQLD를 따고 싶어”처럼 요청해보세요.',
  },
  {
    role: 'user',
    text: '이번 학기에 자격증 부담이 너무 크지 않게 조정해줘.',
  },
  {
    role: 'assistant',
    text: 'SQLD 준비를 8주로 줄이고, 비교과 프로그램은 중간고사 이후로 배치하는 안을 추천합니다.',
  },
];

const studentProfile = [
  { label: '현재 전공', value: '의생명융합공학부 첨단바이오공학전공' },
  { label: '부전공', value: '데이터사이언스' },
  { label: '복수전공', value: '미신청' },
  { label: '진로', value: 'AI 헬스케어 서비스 기획' },
];

const recommendationHighlights = [
  { label: '학업', value: '전공필수 6학점 우선', icon: BookOpen, color: 'text-emerald-300 bg-emerald-950/50 border-emerald-800' },
  { label: '외부 활동', value: '여름방학 인턴/부트캠프 집중', icon: BriefcaseBusiness, color: 'text-blue-300 bg-blue-950/50 border-blue-800' },
  { label: '내부 활동', value: '비교과 2개, 멘토링 1개 추천', icon: GraduationCap, color: 'text-purple-300 bg-purple-950/50 border-purple-800' },
  { label: '자격증/어학', value: 'SQLD, OPIC 순서로 배치', icon: BadgeCheck, color: 'text-amber-300 bg-amber-950/50 border-amber-800' },
];

const completedCredits = {
  total: 83,
  majorRequired: 12,
  majorElective: 18,
  liberalRequired: 8,
  liberalElective: 10,
};

const graduationRequirements = {
  total: 133,
  majorRequired: 20,
  majorElective: 30,
  liberalRequired: 12,
  liberalElective: 15,
};

function summarizeByCategory(items: Array<{ category: string }>) {
  const counts = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).map(([category, count]) => `${category} ${count}건`);
}

function copySemesters(semesters: SemesterPlan[]) {
  return semesters.map((semester) => ({
    ...semester,
    courseSummary: [...semester.courseSummary],
    activitySummary: [...semester.activitySummary],
    courses: semester.courses.map((course) => ({ ...course })),
    activities: semester.activities.map((activity) => ({ ...activity })),
  }));
}

function getRoadmapSummary(semesters: SemesterPlan[]) {
  const courses = semesters.flatMap((semester) => semester.courses);
  const activities = semesters.flatMap((semester) => semester.activities);

  const creditsByCategory = courses.reduce<Record<string, number>>((acc, course) => {
    acc[course.category] = (acc[course.category] ?? 0) + course.credits;
    return acc;
  }, {});

  return {
    plannedTotal: courses.reduce((sum, course) => sum + course.credits, 0),
    plannedMajorRequired: creditsByCategory['전공필수'] ?? 0,
    plannedMajorElective: creditsByCategory['전공선택'] ?? 0,
    plannedLiberalRequired: creditsByCategory['교양필수'] ?? 0,
    plannedLiberalElective: creditsByCategory['교양선택'] ?? 0,
    externalActivities: activities.filter((activity) => activity.category.includes('외부') || activity.name.includes('인턴') || activity.name.includes('부트캠프')).length,
    internalActivities: activities.filter((activity) => activity.category.includes('내부') || activity.name.includes('비교과') || activity.name.includes('멘토링')).length,
    volunteerActivities: activities.filter((activity) => activity.category.includes('봉사') || activity.name.includes('봉사')).length,
    certificates: activities.filter((activity) => activity.category.includes('자격증') || ['SQLD', 'ADsP', '정보처리기사'].some((name) => activity.name.includes(name))).length,
    languages: activities.filter((activity) => activity.category.includes('어학') || activity.name.includes('OPIC') || activity.name.includes('TOEIC')).length,
  };
}

export default function GrowthPlanPage() {
  const [savedRoadmaps, setSavedRoadmaps] = useState<RoadmapSnapshot[]>([
    { id: 'roadmap-1', name: '추천 로드맵 A', semesters: copySemesters(initialSemesters) },
  ]);
  const [activeRoadmapId, setActiveRoadmapId] = useState('roadmap-1');
  const [activeRoadmapName, setActiveRoadmapName] = useState('추천 로드맵 A');
  const [roadmap, setRoadmap] = useState(copySemesters(initialSemesters));
  const [selectedTerm, setSelectedTerm] = useState<string | null>(initialSemesters[0].term);
  const [chatMessages, setChatMessages] = useState(initialMessages);
  const [llmInput, setLlmInput] = useState('');
  const selectedSemester = roadmap.find((semester) => semester.term === selectedTerm) ?? roadmap[0];
  const roadmapSummary = getRoadmapSummary(roadmap);

  function updateCourse(term: string, index: number, field: CourseField, value: string) {
    setRoadmap((currentRoadmap) =>
      currentRoadmap.map((semester) => {
        if (semester.term !== term) return semester;

        return {
          ...semester,
          courses: semester.courses.map((course, courseIndex) => {
            if (courseIndex !== index) return course;
            return {
              ...course,
              [field]: field === 'credits' ? Number(value) || 0 : value,
            };
          }),
        };
      }),
    );
  }

  function updateActivity(term: string, index: number, field: ActivityField, value: string) {
    setRoadmap((currentRoadmap) =>
      currentRoadmap.map((semester) => {
        if (semester.term !== term) return semester;

        return {
          ...semester,
          activities: semester.activities.map((activity, activityIndex) =>
            activityIndex === index ? { ...activity, [field]: value } : activity,
          ),
        };
      }),
    );
  }

  function handleLlmSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = llmInput.trim();
    if (!message) return;

    const normalizedMessage = message.toLowerCase();
    setChatMessages((messages) => [...messages, { role: 'user', text: message }]);
    setLlmInput('');

    if (normalizedMessage.includes('3학년') && normalizedMessage.includes('sqld')) {
      setRoadmap((currentRoadmap) =>
        currentRoadmap.map((semester) => {
          if (semester.term !== '3학년 1학기') return semester;

          const hasSqld = semester.activities.some((activity) => activity.name.toLowerCase().includes('sqld'));
          return {
            ...semester,
            activities: hasSqld
              ? semester.activities.map((activity) =>
                  activity.name.toLowerCase().includes('sqld')
                    ? { ...activity, category: '자격증', name: 'SQLD', period: '3학년 1학기 8주 준비' }
                    : activity,
                )
              : [...semester.activities, { category: '자격증', name: 'SQLD', period: '3학년 1학기 8주 준비' }],
          };
        }),
      );
      setSelectedTerm('3학년 1학기');
      setChatMessages((messages) => [
        ...messages,
        {
          role: 'assistant',
          text: '좋아요. 3학년 1학기 성장 활동에 SQLD 자격증 준비를 추가하고, 준비 기간은 8주로 배치했습니다.',
        },
      ]);
      return;
    }

    setChatMessages((messages) => [
      ...messages,
      {
        role: 'assistant',
        text: '요청을 반영할 수 있도록 선택한 학기의 수강 계획과 성장 활동을 함께 조정해보겠습니다. 와이어프레임에서는 상세 칸을 직접 수정할 수도 있습니다.',
      },
    ]);
  }

  function addSemester() {
    const nextIndex = roadmap.length + 1;
    const term = `사용자 추가 학기 ${nextIndex}`;
    setRoadmap((currentRoadmap) => [
      ...currentRoadmap,
      {
        term,
        focus: '직접 설정',
        credits: '0학점',
        courseSummary: [],
        activitySummary: [],
        courses: [
          { category: '전공선택', name: '새 과목', credits: 3 },
        ],
        activities: [
          { category: '성장활동', name: '새 활동', period: '기간 입력' },
        ],
      },
    ]);
    setSelectedTerm(term);
  }

  function saveRoadmap() {
    const snapshot = {
      id: activeRoadmapId,
      name: activeRoadmapName,
      semesters: copySemesters(roadmap),
    };

    setSavedRoadmaps((currentRoadmaps) => {
      const exists = currentRoadmaps.some((item) => item.id === activeRoadmapId);
      return exists
        ? currentRoadmaps.map((item) => item.id === activeRoadmapId ? snapshot : item)
        : [...currentRoadmaps, snapshot];
    });
  }

  function addRoadmap() {
    const nextIndex = savedRoadmaps.length + 1;
    const nextId = `roadmap-${Date.now()}`;
    const nextName = `내 로드맵 ${nextIndex}`;
    setActiveRoadmapId(nextId);
    setActiveRoadmapName(nextName);
    setRoadmap(copySemesters(initialSemesters));
    setSelectedTerm(initialSemesters[0].term);
    setSavedRoadmaps((currentRoadmaps) => [
      ...currentRoadmaps,
      { id: nextId, name: nextName, semesters: copySemesters(initialSemesters) },
    ]);
  }

  function selectRoadmap(id: string) {
    const nextRoadmap = savedRoadmaps.find((item) => item.id === id);
    if (!nextRoadmap) return;
    setActiveRoadmapId(nextRoadmap.id);
    setActiveRoadmapName(nextRoadmap.name);
    setRoadmap(copySemesters(nextRoadmap.semesters));
    setSelectedTerm(nextRoadmap.semesters[0]?.term ?? null);
  }

  function resetRoadmap() {
    const saved = savedRoadmaps.find((item) => item.id === activeRoadmapId);
    const nextSemesters = saved ? saved.semesters : initialSemesters;
    setRoadmap(copySemesters(nextSemesters));
    setSelectedTerm(nextSemesters[0]?.term ?? null);
  }

  return (
    <div className="flex-1 overflow-y-auto chat-scroll p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs text-emerald-400 uppercase tracking-wider">LLM Semester Planner</p>
          <h2 className="text-2xl font-bold">학기별 성장 계획</h2>
          <p className="text-sm text-slate-400">수강, 비교과, 인턴, 부트캠프, 자격증, 다중전공 요건을 한 번에 배치합니다.</p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <UserRound className="w-5 h-5 text-emerald-400" /> 내 정보
            </h3>
            <span className="text-xs text-slate-500">로드맵 추천 기준</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {studentProfile.map((item) => (
              <div key={item.label} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-3">
                <p className="text-[11px] text-slate-500">{item.label}</p>
                <p className="mt-1 text-sm font-semibold text-slate-200">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {recommendationHighlights.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className={`rounded-lg border p-4 ${color}`}>
              <Icon className="w-5 h-5 mb-3" />
              <p className="text-xs opacity-80">{label}</p>
              <p className="mt-1 text-sm font-semibold">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
          <section className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <div className="flex flex-col gap-4 mb-5">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CalendarRange className="w-5 h-5 text-emerald-400" /> 추천 로드맵
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 outline-none focus:border-emerald-500"
                    value={activeRoadmapId}
                    onChange={(event) => selectRoadmap(event.target.value)}
                    aria-label="로드맵 선택"
                  >
                    {savedRoadmaps.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                  </select>
                  <input
                    className="w-40 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 outline-none focus:border-emerald-500"
                    value={activeRoadmapName}
                    onChange={(event) => setActiveRoadmapName(event.target.value)}
                    aria-label="로드맵 이름"
                  />
                  <button className="rounded-lg border border-slate-600 hover:border-emerald-500 px-3 py-2 text-sm font-semibold text-slate-200 flex items-center gap-2" onClick={addRoadmap}>
                    <Plus className="w-4 h-4" /> 로드맵 추가
                  </button>
                  <button className="rounded-lg border border-slate-600 hover:border-blue-500 px-3 py-2 text-sm font-semibold text-slate-200 flex items-center gap-2" onClick={saveRoadmap}>
                    <Save className="w-4 h-4" /> 저장
                  </button>
                  <button className="rounded-lg border border-slate-600 hover:border-amber-500 px-3 py-2 text-sm font-semibold text-slate-200 flex items-center gap-2" onClick={resetRoadmap}>
                    <RotateCcw className="w-4 h-4" /> 초기화
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CalendarRange className="w-5 h-5 text-emerald-400" /> 학기 구성
              </h3>
              <button className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-2 text-sm font-semibold text-white flex items-center gap-2" onClick={addSemester}>
                <Plus className="w-4 h-4" /> 학기 추가
              </button>
            </div>

            <div className="space-y-4">
              {roadmap.map((semester) => {
                const isSelected = selectedTerm === semester.term;
                const courseSummary = summarizeByCategory(semester.courses);
                const activitySummary = summarizeByCategory(semester.activities);

                return (
                  <div key={semester.term} className="space-y-3">
                    <button
                      className={`w-full text-left grid grid-cols-1 md:grid-cols-[150px_1fr_1fr] gap-4 rounded-lg border p-4 transition ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-950/20'
                          : 'border-slate-700 bg-slate-900/60 hover:border-slate-500'
                      }`}
                      onClick={() => setSelectedTerm((currentTerm) => currentTerm === semester.term ? null : semester.term)}
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-100">{semester.term}</p>
                        <p className="text-xs text-emerald-400 mt-1">{semester.focus}</p>
                        <p className="text-xs text-slate-500 mt-2">{semester.credits}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-2">수강 계획</p>
                        <div className="space-y-1">
                          {courseSummary.map((item) => <p key={item} className="text-sm text-slate-300">- {item}</p>)}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-2">성장 활동</p>
                        <div className="space-y-1">
                          {activitySummary.map((item) => <p key={item} className="text-sm text-slate-300">- {item}</p>)}
                        </div>
                      </div>
                    </button>

                    {isSelected && (
                      <div className="rounded-xl border border-emerald-900/70 bg-slate-900/70 p-5">
                        <div className="flex flex-col gap-1 mb-4">
                          <p className="text-xs text-emerald-400">선택 학기 상세</p>
                          <h4 className="text-lg font-semibold">{semester.term} 상세 계획</h4>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                          <div>
                            <p className="text-sm font-semibold text-slate-200 mb-3">수강 계획</p>
                            <div className="overflow-hidden rounded-lg border border-slate-700">
                              <table className="w-full table-fixed text-sm">
                                <colgroup>
                                  <col className="w-28" />
                                  <col />
                                  <col className="w-20" />
                                </colgroup>
                                <thead className="bg-slate-950/80 text-xs text-slate-400">
                                  <tr>
                                    <th className="px-3 py-2 text-left font-medium">교과구분</th>
                                    <th className="px-3 py-2 text-left font-medium">과목명</th>
                                    <th className="px-3 py-2 text-right font-medium">학점</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700 bg-slate-950/40">
                                  {semester.courses.map((course, courseIndex) => (
                                    <tr key={`${course.category}-${course.name}`}>
                                      <td className="px-2 py-2 align-top">
                                        <input
                                          className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-emerald-300 outline-none focus:border-emerald-500"
                                          value={course.category}
                                          onChange={(event) => updateCourse(semester.term, courseIndex, 'category', event.target.value)}
                                          aria-label={`${semester.term} ${course.name} 교과구분`}
                                        />
                                      </td>
                                      <td className="px-2 py-2 align-top">
                                        <input
                                          className="w-full min-w-0 rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-200 outline-none focus:border-emerald-500"
                                          value={course.name}
                                          onChange={(event) => updateCourse(semester.term, courseIndex, 'name', event.target.value)}
                                          aria-label={`${semester.term} ${course.name} 과목명`}
                                        />
                                      </td>
                                      <td className="px-2 py-2 align-top">
                                        <input
                                          className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-right text-sm font-semibold text-slate-300 outline-none focus:border-emerald-500"
                                          type="number"
                                          min="0"
                                          value={course.credits}
                                          onChange={(event) => updateCourse(semester.term, courseIndex, 'credits', event.target.value)}
                                          aria-label={`${semester.term} ${course.name} 학점`}
                                        />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-200 mb-3">성장 활동</p>
                            <div className="overflow-hidden rounded-lg border border-slate-700">
                              <table className="w-full table-fixed text-sm">
                                <colgroup>
                                  <col className="w-28" />
                                  <col />
                                  <col className="w-24" />
                                </colgroup>
                                <thead className="bg-slate-950/80 text-xs text-slate-400">
                                  <tr>
                                    <th className="px-3 py-2 text-left font-medium">활동구분</th>
                                    <th className="px-3 py-2 text-left font-medium">이름</th>
                                    <th className="px-3 py-2 text-left font-medium">기간</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700 bg-slate-950/40">
                                  {semester.activities.map((activity, activityIndex) => (
                                    <tr key={`${activity.category}-${activity.name}`}>
                                      <td className="px-2 py-2 align-top">
                                        <input
                                          className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-blue-300 outline-none focus:border-emerald-500"
                                          value={activity.category}
                                          onChange={(event) => updateActivity(semester.term, activityIndex, 'category', event.target.value)}
                                          aria-label={`${semester.term} ${activity.name} 활동구분`}
                                        />
                                      </td>
                                      <td className="px-2 py-2 align-top">
                                        <input
                                          className="w-full min-w-0 rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-200 outline-none focus:border-emerald-500"
                                          value={activity.name}
                                          onChange={(event) => updateActivity(semester.term, activityIndex, 'name', event.target.value)}
                                          aria-label={`${semester.term} ${activity.name} 이름`}
                                        />
                                      </td>
                                      <td className="px-2 py-2 align-top">
                                        <input
                                          className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-400 outline-none focus:border-emerald-500"
                                          value={activity.period}
                                          onChange={(event) => updateActivity(semester.term, activityIndex, 'period', event.target.value)}
                                          aria-label={`${semester.term} ${activity.name} 기간`}
                                        />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-5 rounded-xl border border-slate-700 bg-slate-900/70 p-5">
              <div className="flex flex-col gap-1 mb-4">
                <p className="text-xs text-emerald-400">로드맵 결과 요약</p>
                <h4 className="text-lg font-semibold">{activeRoadmapName} 기준 달성 예상</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                <SummaryCard
                  label="총 이수 학점"
                  value={`${completedCredits.total + roadmapSummary.plannedTotal}/${graduationRequirements.total}학점`}
                  caption={`기이수 ${completedCredits.total} + 예정 ${roadmapSummary.plannedTotal}`}
                />
                <SummaryCard
                  label="전공필수"
                  value={`${completedCredits.majorRequired + roadmapSummary.plannedMajorRequired}/${graduationRequirements.majorRequired}학점`}
                  caption={`기이수 ${completedCredits.majorRequired} + 예정 ${roadmapSummary.plannedMajorRequired}`}
                />
                <SummaryCard
                  label="전공선택"
                  value={`${completedCredits.majorElective + roadmapSummary.plannedMajorElective}/${graduationRequirements.majorElective}학점`}
                  caption={`기이수 ${completedCredits.majorElective} + 예정 ${roadmapSummary.plannedMajorElective}`}
                />
                <SummaryCard
                  label="교양필수"
                  value={`${completedCredits.liberalRequired + roadmapSummary.plannedLiberalRequired}/${graduationRequirements.liberalRequired}학점`}
                  caption={`기이수 ${completedCredits.liberalRequired} + 예정 ${roadmapSummary.plannedLiberalRequired}`}
                />
                <SummaryCard
                  label="교양선택"
                  value={`${completedCredits.liberalElective + roadmapSummary.plannedLiberalElective}/${graduationRequirements.liberalElective}학점`}
                  caption={`기이수 ${completedCredits.liberalElective} + 예정 ${roadmapSummary.plannedLiberalElective}`}
                />
                <SummaryCard label="외부활동" value={`${roadmapSummary.externalActivities}건`} caption="인턴, 부트캠프 포함" />
                <SummaryCard label="내부활동" value={`${roadmapSummary.internalActivities}건`} caption="비교과, 멘토링 포함" />
                <SummaryCard label="봉사활동" value={`${roadmapSummary.volunteerActivities}건`} caption="교내외 봉사 계획" />
                <SummaryCard label="자격증" value={`${roadmapSummary.certificates}개`} caption="SQLD 등 취득 계획" />
                <SummaryCard label="어학" value={`${roadmapSummary.languages}건`} caption="OPIC, TOEIC 등" />
              </div>
            </div>
          </section>

          <aside className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MessageSquareText className="w-5 h-5 text-emerald-400" /> LLM 성장 상담
            </h3>
            <div className="space-y-3 rounded-lg border border-slate-700 bg-slate-900 p-3 min-h-[300px]">
              <div className="rounded-2xl rounded-bl-md bg-slate-800 px-3 py-2 text-sm text-slate-200">
                {selectedTerm ? `${selectedSemester.term}에는 ${selectedSemester.focus}가 핵심입니다.` : '학기를 선택하거나 LLM에게 원하는 계획을 말해보세요.'}
              </div>
              {chatMessages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`rounded-2xl px-3 py-2 text-sm ${
                    message.role === 'user'
                      ? 'ml-8 rounded-br-md bg-emerald-600 text-white'
                      : 'rounded-bl-md bg-slate-800 text-slate-200'
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>
            <form className="mt-3 flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" onSubmit={handleLlmSubmit}>
              <input
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-500"
                placeholder="예: 3학년 때는 SQLD를 따고 싶어"
                value={llmInput}
                onChange={(event) => setLlmInput(event.target.value)}
              />
              <button type="submit" className="rounded-md bg-emerald-600 p-2 text-white hover:bg-emerald-500" aria-label="메시지 보내기">
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-5 rounded-lg bg-emerald-950/40 border border-emerald-900 p-4">
              <Languages className="w-5 h-5 text-emerald-300 mb-2" />
              <p className="text-sm text-emerald-100 font-medium">다중 전공 체크</p>
              <p className="text-xs text-emerald-300/80 mt-1">주전공과 부전공 졸업요건을 함께 계산해 과목 충돌을 줄입니다.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

interface SummaryCardProps {
  label: string;
  value: string;
  caption: string;
}

function SummaryCard({ label, value, caption }: SummaryCardProps) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-950/50 px-3 py-3">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-emerald-300">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{caption}</p>
    </div>
  );
}
