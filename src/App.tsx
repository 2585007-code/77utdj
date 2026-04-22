import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Trash2, Plus, MapPin } from "lucide-react";

interface Goal {
  id: string;
  text: string;
  completed: boolean;
  progress?: number;
  colorTheme?: string;
}

const pastelThemes = [
  "bg-[#FFF0F5] border-[#FFB6C1]", // pink
  "bg-[#F0F8FF] border-[#B0E0E6]", // blue
  "bg-[#FFF8DC] border-[#F5DEB3]", // amber
  "bg-[#F5FFFA] border-[#A9DFBF]", // green
  "bg-[#F3E5F5] border-[#D2B4DE]", // purple
];

const quotes = [
  "작은 노력이 모여 큰 성공을 만들어요! 🌟",
  "실수해도 괜찮아요, 배우는 과정이니까요! 🌱",
  "당신의 가능성은 무한대예요! 🚀",
  "오늘도 한 걸음 나아간 당신을 칭찬해요! 👏",
  "포기하지 않는 당신이 가장 멋져요! ✨",
  "꾸준함은 모든 것을 이겨낸답니다! 🐢💨"
];

const KR_CITIES = [
  { id: "auto", name: "📍 현재 위치" },
  { id: "Seoul", name: "🏙️ 서울" },
  { id: "Busan", name: "🌊 부산" },
  { id: "Incheon", name: "✈️ 인천" },
  { id: "Daegu", name: "🍎 대구" },
  { id: "Daejeon", name: "🔬 대전" },
  { id: "Gwangju", name: "✨ 광주" },
  { id: "Jeju", name: "🌴 제주" }
];

export default function App() {
  // 1. Data initialization with localStorage
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem("studyGoals");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState(false);
  const [weather, setWeather] = useState("날씨 불러오는 중... ☁️");
  const [selectedCity, setSelectedCity] = useState("auto");
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Track which goal is currently asking for confirmation
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const quote = useMemo(() => quotes[Math.floor(Math.random() * quotes.length)], []);

  // Clock Logic
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateStr = currentTime.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
  const timeStr = currentTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

  // Weather Widget Logic
  useEffect(() => {
    const fetchWeather = async (query: string) => {
      try {
        setWeather("불러오는 중... ☁️");
        const res = await fetch(`https://wttr.in/${query}?format=%c+%t`);
        if (res.ok) {
          const text = await res.text();
          // Protect against wttr.in returning an HTML page instead of short plain string.
          if (text.includes("<") || text.includes(">") || text.length > 30) {
            setWeather("날씨 정보 지연 ⏳");
          } else {
            setWeather(text.trim());
          }
        } else {
          setWeather("정보 없음 😢");
        }
      } catch (e) {
        setWeather("정보 오류 🌧️");
      }
    };

    if (selectedCity === "auto") {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          // Important: wttr.in expects ~ before coordinates
          (position) => fetchWeather(`~${position.coords.latitude},${position.coords.longitude}`),
          () => fetchWeather("Seoul")
        );
      } else {
        fetchWeather("Seoul");
      }
    } else {
      fetchWeather(selectedCity);
    }
  }, [selectedCity]);

  // 2. Save data to localStorage on changes
  useEffect(() => {
    localStorage.setItem("studyGoals", JSON.stringify(goals));
  }, [goals]);

  // 3. Add Goal with empty check and error animation
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      setInputError(true);
      setTimeout(() => setInputError(false), 500);
      return;
    }
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      progress: 0,
      colorTheme: pastelThemes[Math.floor(Math.random() * pastelThemes.length)]
    };
    setGoals([newGoal, ...goals]);
    setInputValue("");
  };

  // 4. Toggle completion
  const handleToggle = (id: string) => {
    setGoals(
      goals.map((g) => {
        if (g.id === id) {
          const willComplete = !g.completed;
          return { ...g, completed: willComplete, progress: willComplete ? 100 : 0 };
        }
        return g;
      })
    );
  };

  const handleProgressChange = (id: string, newProgress: number) => {
    setGoals(
      goals.map((g) => {
        if (g.id === id) {
          const completed = newProgress === 100;
          return { ...g, progress: newProgress, completed };
        }
        return g;
      })
    );
  };

  // 5. Delete Handling
  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setConfirmDeleteId(id);
  };

  const confirmDelete = (id: string) => {
    setGoals(goals.filter((g) => g.id !== id));
    setConfirmDeleteId(null);
  };

  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const handleClearCompleted = () => {
    if (goals.filter(g => g.completed).length === 0) return;
    setGoals(goals.filter((g) => !g.completed));
    setConfirmDeleteId(null);
  };

  return (
    // Main Container: Mint green background, centered layout
    <div className="min-h-screen bg-[#F0FAF7] text-gray-700 font-sans flex items-center justify-center p-4">
      {/* Main Card: White, heavily rounded, soft shadow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white max-w-[500px] w-full min-h-[650px] max-h-[90vh] flex flex-col rounded-[40px] px-8 py-8 shadow-[0_15px_35px_rgba(167,219,190,0.3)] border-[8px] border-[#B2E2D2] relative overflow-hidden"
      >
        {/* Background decorative blob */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#B2E2D2]/30 rounded-full mix-blend-multiply filter blur-2xl animate-pulse pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#4CAF93]/20 rounded-full mix-blend-multiply filter blur-2xl pointer-events-none"></div>

        {/* Date, Time & Weather Widget */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#F0FAF7] border-2 border-[#B2E2D2] rounded-2xl p-4 mb-5 relative z-10 shadow-sm gap-3 sm:gap-2">
          {/* Time & Date */}
          <div className="text-[#4CAF93] font-bold">
            <div className="text-2xl leading-none">{timeStr}</div>
            <div className="text-sm opacity-80 mt-1">{dateStr}</div>
          </div>

          {/* Weather & Dropdown */}
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-[#B2E2D2] shadow-sm flex-shrink-0 self-start sm:self-auto overflow-hidden max-w-full">
            <span className="text-sm font-sans font-medium whitespace-nowrap text-gray-700">{weather}</span>
            <div className="w-[2px] h-4 bg-[#B2E2D2] mx-1 rounded-full opacity-50 flex-shrink-0"></div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent text-[#4CAF93] font-bold outline-none cursor-pointer text-sm appearance-none pr-1 hover:opacity-80 transition-opacity truncate"
            >
              {KR_CITIES.map(city => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
            {/* Arrow SVG for select */}
            <div className="pointer-events-none text-[#4CAF93]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
        </div>

        {/* Header with animated emojis */}
        <header className="flex items-center space-x-3 mb-5 relative z-10 justify-center">
          <motion.div
            animate={{ rotate: [0, 15, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="text-4xl shadow-sm"
          >
            ☘️
          </motion.div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#4CAF93] mb-1 tracking-tight">
              오늘의 공부 목표
            </h1>
            <p className="text-gray-500 text-lg">매일매일 한 걸음씩 성장해요!</p>
          </div>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="text-3xl drop-shadow-sm hidden sm:block"
          >
            ✨
          </motion.div>
        </header>

        {/* Add Task Form */}
        <motion.form 
          onSubmit={handleAdd} 
          animate={inputError ? { x: [-5, 5, -5, 5, 0] } : {}}
          transition={{ duration: 0.3 }}
          className="flex gap-2 mb-6 relative z-10"
        >
          <input
            type="text"
            placeholder={inputError ? "목표를 입력해주세요! 🚨" : "무엇을 배울까요?"}
            className={`flex-1 border-2 text-gray-800 rounded-2xl px-5 py-3 text-xl focus:outline-none transition-all placeholder-gray-400 font-medium ${
              inputError ? "border-red-300 bg-red-50/50" : "bg-gray-50 border-gray-100 focus:border-[#B2E2D2]"
            }`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            type="submit"
            className="bg-[#B2E2D2] hover:brightness-105 active:scale-95 text-white px-5 rounded-2xl flex items-center justify-center transition-all shadow-sm flex-shrink-0"
          >
            <Plus size={26} strokeWidth={3} />
          </button>
        </motion.form>

        {/* Task List */}
        <div className="space-y-3 z-10 relative flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {goals.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-[#B2E2D2] py-10 flex flex-col items-center gap-2"
              >
                <span className="text-5xl text-[#B2E2D2] mb-2 drop-shadow-sm">🌱</span>
                <p className="font-bold text-gray-500 text-xl">아직 등록된 목표가 없어요!</p>
                <p className="text-lg text-gray-400">힘차게 시작해볼까요?</p>
              </motion.div>
            ) : (
              goals.map((goal) => {
                const checkedTheme = goal.colorTheme || pastelThemes[0];

                return (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  key={goal.id}
                  className={`group flex flex-col p-4 rounded-2xl border transition-all relative ${
                    goal.completed
                      ? `${checkedTheme} opacity-90 shadow-sm`
                      : "bg-gray-50 border-transparent hover:border-[#B2E2D2] shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <label className="flex items-center gap-4 cursor-pointer flex-1 overflow-hidden pr-2">
                      <div className="relative flex items-center justify-center flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={goal.completed}
                          onChange={() => {
                            handleToggle(goal.id);
                            setConfirmDeleteId(null);
                          }}
                          className="peer appearance-none w-6 h-6 border-2 border-[#B2E2D2] rounded-xl checked:bg-[#4CAF93] checked:border-[#4CAF93] cursor-pointer transition-colors"
                        />
                        <Check
                          size={14}
                          strokeWidth={4}
                          className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                        />
                      </div>
                      {/* Animated Strikethrough Text */}
                      <span className="relative flex-1 block">
                        <span
                          className={`font-medium text-xl block truncate transition-colors duration-300 ${
                            goal.completed ? "text-gray-500" : "text-gray-700"
                          }`}
                        >
                          {goal.text}
                        </span>
                        <span
                          className="absolute left-0 top-1/2 h-[3px] mt-[1px] bg-gray-500 transition-all duration-300 ease-out origin-left rounded-full"
                          style={{ width: goal.completed ? "100%" : "0%" }}
                        />
                      </span>
                    </label>
                    
                    {/* Delete Button / Inline Confirmation */}
                    <AnimatePresence mode="wait">
                      {confirmDeleteId === goal.id ? (
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex gap-1 flex-shrink-0"
                        >
                          <button
                            onClick={() => confirmDelete(goal.id)}
                            className="bg-red-400 text-white px-3 py-1.5 rounded-xl text-sm font-bold shadow-sm hover:bg-red-500 active:scale-95 transition-all"
                          >
                            삭제
                          </button>
                          <button
                            onClick={cancelDelete}
                            className="bg-gray-200 text-gray-600 px-3 py-1.5 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-300 active:scale-95 transition-all"
                          >
                            취소
                          </button>
                        </motion.div>
                      ) : (
                        <motion.button
                          layout
                          initial={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={(e) => handleDeleteClick(goal.id, e)}
                          className="opacity-60 hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 flex-shrink-0 text-red-300 hover:text-white hover:bg-pink-400 p-2 rounded-xl transition-all"
                          aria-label="삭제"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Progress Bar Container */}
                  <div className="pl-[2.5rem] pr-12 mt-2 flex items-center gap-3 w-full">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={goal.progress ?? (goal.completed ? 100 : 0)}
                      onChange={(e) => handleProgressChange(goal.id, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#4CAF93] hover:accent-[#3d8c76] transition-all"
                    />
                    <span className={`text-[0.75rem] font-bold min-w-[32px] text-right font-sans transition-colors ${goal.completed ? "text-gray-500" : "text-[#4CAF93]"}`}>
                      {goal.progress ?? (goal.completed ? 100 : 0)}%
                    </span>
                  </div>
                </motion.div>
              )})
            )}
          </AnimatePresence>
        </div>

        <footer className="mt-4 pt-5 border-t-2 border-gray-100 flex flex-col justify-center items-center z-10 relative flex-shrink-0 gap-3">
          <p className="text-[#4CAF93] font-bold text-lg text-center flex items-center gap-2">
            <span className="animate-pulse">💡</span> {quote}
          </p>
          
          <AnimatePresence>
            {goals.some(g => g.completed) && (
              <motion.button
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onClick={handleClearCompleted}
                className="text-pink-400 font-bold hover:text-pink-500 hover:bg-pink-50 px-4 py-1.5 rounded-full transition-all text-sm mb-1"
              >
                완료된 항목 모두 삭제 ✨
              </motion.button>
            )}
          </AnimatePresence>
        </footer>
      </motion.div>
    </div>
  );
}
