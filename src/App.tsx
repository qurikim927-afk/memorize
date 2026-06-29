import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  Scale, 
  Calculator, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle,
  Hash,
  Eye,
  EyeOff
} from "lucide-react";
import { SUBJECTS, KEY_NUMBERS, SUBJECTS as DATA_SUBJECTS } from "./data";

export default function App() {
  const [activeSubject, setActiveSubject] = useState<string>("food-safety");
  const [searchQuery, setSearchQuery] = useState<string>(" ");
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});
  const [hideNumbers, setHideNumbers] = useState<boolean>(true);
  const [revealedNumbers, setRevealedNumbers] = useState<Record<string, boolean>>({});

  // 초기 로드 시 첫 번째 과목의 모든 챕터를 기본으로 열어두기 및 검색어 빈 문자열로 초기화
  useEffect(() => {
    setSearchQuery("");
    const initialExpanded: Record<string, boolean> = {};
    SUBJECTS.forEach(sub => {
      sub.chapters.forEach(ch => {
        initialExpanded[ch.id] = true;
      });
    });
    setExpandedChapters(initialExpanded);
  }, []);

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  const toggleNumberReveal = (id: string) => {
    setRevealedNumbers(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // 검색 필터링 로직
  const filteredSubjects = SUBJECTS.map(sub => {
    const matchedChapters = sub.chapters.filter(ch => {
      if (!searchQuery.trim()) return true;
      const lowerQuery = searchQuery.toLowerCase();
      const matchTitle = ch.title.toLowerCase().includes(lowerQuery);
      const matchItems = ch.items.some(item => item.toLowerCase().includes(lowerQuery));
      return matchTitle || matchItems;
    });

    return {
      ...sub,
      chapters: matchedChapters
    };
  }).filter(sub => sub.chapters.length > 0);

  // 현재 활성화된 과목 데이터 찾기
  const currentSubject = SUBJECTS.find(s => s.id === activeSubject);

  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        const innerText = part.slice(2, -2);
        return (
          <strong key={idx} className="font-bold text-slate-900 bg-amber-50 border border-amber-200/60 px-1 py-0.5 rounded text-[13px] inline-block my-0.5 shadow-2xs">
            {innerText}
          </strong>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24 antialiased">
      
      {/* Mobile Top Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-100 z-50 px-4 py-3.5 shadow-2xs">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles size={16} />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight text-slate-900">모바일 핵심 요약 노트</h1>
              <p className="text-[10px] text-slate-500 font-medium">시험 빈출 숫자 · 기준 중심 요약</p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
            수험생 전용
          </span>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-4 space-y-4">

        {/* 2. Search Box */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="검색할 숫자나 키워드를 입력하세요... (예: 2인, 150)"
            className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-2.5 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 outline-none shadow-2xs transition"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              지우기
            </button>
          )}
        </div>

        {/* CONDITIONAL RENDERING based on search query presence */}
        {searchQuery.trim() ? (
          // SEARCH RESULTS VIEW
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>검색된 결과 챕터: <strong className="text-blue-600 font-bold">{filteredSubjects.reduce((acc, s) => acc + s.chapters.length, 0)}</strong>개</span>
              <button onClick={() => setSearchQuery("")} className="text-blue-500 font-bold">전체보기로 돌아가기</button>
            </div>

            <div className="space-y-3">
              {filteredSubjects.map(sub => (
                <div key={sub.id} className="space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase pl-1">
                    {sub.title}
                  </div>
                  {sub.chapters.map(ch => (
                    <div key={ch.id} className="bg-white border border-slate-100 rounded-xl p-3.5 shadow-2xs space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold text-slate-900">{ch.title}</h4>
                        <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          {ch.badge}
                        </span>
                      </div>
                      <ul className="space-y-2 border-t border-slate-50 pt-2 text-xs text-slate-600">
                        {ch.items.map((item, idx) => (
                          <li key={idx} className="relative pl-3.5 leading-relaxed">
                            <span className="absolute left-0 top-1.5 w-1 h-1 bg-slate-300 rounded-full" />
                            {renderFormattedText(item)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
              {filteredSubjects.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 text-slate-400 text-xs">
                  검색 결과가 없습니다. 다른 단어나 숫자를 입력해 보세요.
                </div>
              )}
            </div>
          </div>
        ) : (
          // MAIN DIRECT STUDY VIEW (Tabs + Content)
          <div className="space-y-4">
            
            {/* Subject Selector Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {SUBJECTS.map(sub => {
                const isActive = sub.id === activeSubject;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSubject(sub.id)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer flex-1 justify-center ${
                      isActive 
                        ? "bg-blue-600 text-white shadow-xs" 
                        : "bg-white text-slate-500 hover:text-slate-800 border border-slate-200/80"
                    }`}
                  >
                    {sub.id === "food-safety" && <BookOpen size={13} />}
                    {sub.id === "fair-trade" && <Scale size={13} />}
                    {sub.id === "accounting-basics" && <Calculator size={13} />}
                    <span>{sub.title.split(" ")[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Subject Intro Badge */}
            {currentSubject && (
              <div className="bg-white border border-slate-100 rounded-xl p-3 flex items-center justify-between shadow-2xs">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900">{currentSubject.title}</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">{currentSubject.subtitle}</p>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">
                  {currentSubject.chapters.length}개 단원
                </span>
              </div>
            )}

            {/* Chapters Accordions */}
            <div className="space-y-2.5">
              {currentSubject?.chapters.map(ch => {
                const isExpanded = expandedChapters[ch.id] !== false;
                return (
                  <div 
                    key={ch.id}
                    className="bg-white border border-slate-200/60 rounded-xl overflow-hidden shadow-2xs transition"
                  >
                    {/* Accordion Trigger */}
                    <button 
                      onClick={() => toggleChapter(ch.id)}
                      className="w-full text-left px-3.5 py-3 flex items-center justify-between gap-2 hover:bg-slate-50 transition cursor-pointer"
                    >
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <span className="inline-block text-[8px] font-black tracking-wide bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-sm uppercase">
                          {ch.badge || "기출"}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 truncate">{ch.title}</h4>
                      </div>
                      <div className="text-slate-400">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </button>

                    {/* Accordion Content */}
                    {isExpanded && (
                      <div className="px-3.5 pb-3.5 pt-1.5 border-t border-slate-100/60 bg-slate-50/30">
                        <ul className="space-y-2.5 text-xs text-slate-600">
                          {ch.items.map((item, idx) => {
                            const isExamPoint = item.includes("★");
                            return (
                              <li 
                                key={idx} 
                                className={`leading-relaxed relative pl-3.5 ${
                                  isExamPoint 
                                    ? "bg-amber-50/50 border-l-2 border-amber-400 pl-2.5 py-1 text-slate-700 font-medium rounded-r" 
                                    : ""
                                }`}
                              >
                                {!isExamPoint && (
                                  <span className="absolute left-0.5 top-1.5 w-1 h-1 bg-slate-400 rounded-full" />
                                )}
                                <div className="break-all whitespace-pre-wrap">
                                  {renderFormattedText(item)}
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 3. KEY NUMBERS MEMORIZATION PANEL */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3.5">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-3.5 bg-amber-500 rounded-full" />
                  <h3 className="text-xs font-black text-slate-900">숫자 암기 가림판</h3>
                </div>
                
                {/* Mode toggle */}
                <button
                  onClick={() => setHideNumbers(!hideNumbers)}
                  className={`text-[10px] px-2 py-1 rounded-md font-extrabold flex items-center gap-1 cursor-pointer transition ${
                    hideNumbers 
                      ? "bg-amber-100 text-amber-800" 
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {hideNumbers ? <EyeOff size={11} /> : <Eye size={11} />}
                  <span>{hideNumbers ? "가림 모드 On" : "가림 해제"}</span>
                </button>
              </div>

              <p className="text-[10px] text-slate-500 leading-relaxed">
                현재 과목에 속하는 빈출 수치들입니다. 우측 가림판을 터치하여 머릿속으로 정답을 떠올려보고 맞춰보세요!
              </p>

              <div className="space-y-1.5 pt-1">
                {KEY_NUMBERS
                  .filter(k => {
                    if (activeSubject === "food-safety") return k.category === "식품위생";
                    if (activeSubject === "fair-trade") return k.category === "공정거래";
                    return k.category === "회계기초";
                  })
                  .map(k => {
                    const isRevealed = revealedNumbers[k.id] || !hideNumbers;
                    return (
                      <div 
                        key={k.id}
                        onClick={() => toggleNumberReveal(k.id)}
                        className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-100 rounded-xl cursor-pointer transition select-none gap-3"
                      >
                        <span className="text-xs text-slate-700 font-medium leading-relaxed flex-1 min-w-0 break-keep">
                          {k.item}
                        </span>
                        
                        <div className="text-right flex-shrink-0 min-w-[110px] max-w-[45%]">
                          {isRevealed ? (
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-1 rounded-lg block text-center">
                              {k.value}
                            </span>
                          ) : (
                            <span className="text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200/60 px-2 py-1 rounded-lg block text-center animate-pulse-soft">
                              터치하여 확인 🙈
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Floating Bottom Navigator Bar for quick switch of subjects */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 py-2.5 px-4 shadow-md z-40">
        <div className="max-w-md mx-auto flex justify-around items-center text-[10px] text-slate-400 font-bold">
          <button 
            onClick={() => { setActiveSubject("food-safety"); setSearchQuery(""); }}
            className={`flex flex-col items-center gap-1 transition ${activeSubject === "food-safety" ? "text-blue-600" : "hover:text-slate-600"}`}
          >
            <BookOpen size={16} />
            <span>식품위생</span>
          </button>
          <button 
            onClick={() => { setActiveSubject("fair-trade"); setSearchQuery(""); }}
            className={`flex flex-col items-center gap-1 transition ${activeSubject === "fair-trade" ? "text-blue-600" : "hover:text-slate-600"}`}
          >
            <Scale size={16} />
            <span>공정거래</span>
          </button>
          <button 
            onClick={() => { setActiveSubject("accounting-basics"); setSearchQuery(""); }}
            className={`flex flex-col items-center gap-1 transition ${activeSubject === "accounting-basics" ? "text-blue-600" : "hover:text-slate-600"}`}
          >
            <Calculator size={16} />
            <span>회계기초</span>
          </button>
        </div>
      </footer>

    </div>
  );
}
