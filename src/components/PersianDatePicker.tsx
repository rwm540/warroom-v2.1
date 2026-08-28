import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Check, X, Sparkles } from 'lucide-react';
import { formatToPersianDigits, normalizeToEnglishDigits } from '../utils/jalali';

interface PersianDatePickerProps {
  value: string;
  onChange: (dateStr: string) => void;
  isGirls?: boolean;
  placeholder?: string;
  required?: boolean;
  id?: string;
}

const PERSIAN_MONTHS = [
  { id: 1, name: 'فروردین', days: 31 },
  { id: 2, name: 'اردیبهشت', days: 31 },
  { id: 3, name: 'خرداد', days: 31 },
  { id: 4, name: 'تیر', days: 31 },
  { id: 5, name: 'مرداد', days: 31 },
  { id: 6, name: 'شهریور', days: 31 },
  { id: 7, name: 'مهر', days: 30 },
  { id: 8, name: 'آبان', days: 30 },
  { id: 9, name: 'آذر', days: 30 },
  { id: 10, name: 'دی', days: 30 },
  { id: 11, name: 'بهمن', days: 30 },
  { id: 12, name: 'اسفند', days: 29 }
];

export default function PersianDatePicker({
  value,
  onChange,
  isGirls = false,
  placeholder = 'انتخاب تاریخ تولد',
  required = false,
  id
}: PersianDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current value or default to a reasonable student birth year (e.g. 1388)
  const parseDate = (dateString: string) => {
    const clean = normalizeToEnglishDigits(dateString).replace(/-/g, '/');
    const parts = clean.split('/');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const d = parseInt(parts[2], 10);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        return { year: y, month: m, day: d };
      }
    }
    return { year: 1388, month: 6, day: 15 };
  };

  const initial = parseDate(value);
  const [selectedYear, setSelectedYear] = useState<number>(initial.year);
  const [selectedMonth, setSelectedMonth] = useState<number>(initial.month);
  const [selectedDay, setSelectedDay] = useState<number>(initial.day);
  const [viewMode, setViewMode] = useState<'days' | 'months' | 'years'>('days');

  // Sync state if external value changes
  useEffect(() => {
    if (value) {
      const parsed = parseDate(value);
      setSelectedYear(parsed.year);
      setSelectedMonth(parsed.month);
      setSelectedDay(parsed.day);
    }
  }, [value]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // List of candidate years (from 1370 to 1403 - covers elementary, high school, youth)
  const yearsList = Array.from({ length: 34 }, (_, i) => 1403 - i);

  // Get days in selected month
  const currentMonthInfo = PERSIAN_MONTHS.find(m => m.id === selectedMonth) || PERSIAN_MONTHS[0];
  const maxDays = currentMonthInfo.days;

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
    const formatted = `${selectedYear}/${String(selectedMonth).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
    onChange(formatted);
    setIsOpen(false);
  };

  const handleQuickPreset = (year: number) => {
    setSelectedYear(year);
    const formatted = `${year}/${String(selectedMonth).padStart(2, '0')}/${String(selectedDay).padStart(2, '0')}`;
    onChange(formatted);
  };

  const activeThemeColor = isGirls ? 'pink' : 'cyan';

  return (
    <div className="relative w-full" ref={containerRef} id={id}>
      
      {/* Input trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full py-2 px-3 rounded-xl border text-xs font-mono transition flex items-center justify-between shadow-inner focus:outline-none ${
          isGirls
            ? 'bg-pink-950/40 border-pink-500/50 hover:border-pink-400 text-pink-100 focus:border-pink-400 focus:ring-1 focus:ring-pink-500/40'
            : 'bg-slate-950/70 border-slate-700 hover:border-cyan-400 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/40'
        } ${isOpen ? (isGirls ? 'border-pink-400 ring-2 ring-pink-500/30' : 'border-cyan-400 ring-2 ring-cyan-500/30') : ''}`}
      >
        <div className="flex items-center gap-2">
          <CalendarIcon 
            size={15} 
            className={isGirls ? 'text-pink-400' : 'text-cyan-400'} 
          />
          <span className={value ? 'text-white font-bold' : 'text-slate-500 font-sans'}>
            {value ? formatToPersianDigits(value) : placeholder}
          </span>
        </div>

        {value ? (
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-sans font-bold ${
            isGirls ? 'bg-pink-900/60 text-pink-300' : 'bg-cyan-900/60 text-cyan-300'
          }`}>
            {currentMonthInfo.name} {formatToPersianDigits(selectedYear)}
          </span>
        ) : (
          <span className="text-[10px] text-slate-500 font-sans">انتخاب تقویم</span>
        )}
      </button>

      {/* Hidden input for form requirements if necessary */}
      {required && (
        <input 
          type="text" 
          required 
          value={value} 
          onChange={() => {}} 
          className="sr-only" 
          tabIndex={-1}
        />
      )}

      {/* Dropdown Calendar Picker Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className={`absolute top-full mt-2 right-0 left-0 sm:left-auto sm:w-80 rounded-2xl border p-3 z-50 backdrop-blur-2xl shadow-2xl font-sans text-right ${
              isGirls
                ? 'bg-[#18061d]/95 border-pink-500/60 text-pink-100 shadow-[0_10px_35px_rgba(244,63,94,0.35)]'
                : 'bg-[#061126]/95 border-cyan-500/60 text-slate-100 shadow-[0_10px_35px_rgba(6,182,212,0.35)]'
            }`}
          >
            
            {/* Header: Month & Year Navigator */}
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setViewMode(viewMode === 'months' ? 'days' : 'months')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    viewMode === 'months'
                      ? (isGirls ? 'bg-pink-500 text-white' : 'bg-cyan-500 text-slate-950')
                      : 'bg-white/5 hover:bg-white/10 text-white'
                  }`}
                >
                  <span>{currentMonthInfo.name}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode(viewMode === 'years' ? 'days' : 'years')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition flex items-center gap-1 ${
                    viewMode === 'years'
                      ? (isGirls ? 'bg-pink-500 text-white' : 'bg-cyan-500 text-slate-950')
                      : 'bg-white/5 hover:bg-white/10 text-white'
                  }`}
                >
                  <span>{formatToPersianDigits(selectedYear)}</span>
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedMonth > 1) {
                      setSelectedMonth(selectedMonth - 1);
                    } else {
                      setSelectedMonth(12);
                      setSelectedYear(selectedYear - 1);
                    }
                  }}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
                  title="ماه قبل"
                >
                  <ChevronRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedMonth < 12) {
                      setSelectedMonth(selectedMonth + 1);
                    } else {
                      setSelectedMonth(1);
                      setSelectedYear(selectedYear + 1);
                    }
                  }}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
                  title="ماه بعد"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-rose-400 transition mr-1"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* VIEW 1: DAYS GRID */}
            {viewMode === 'days' && (
              <div className="space-y-2">
                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 pb-1">
                  <span>ش</span>
                  <span>ی</span>
                  <span>د</span>
                  <span>س</span>
                  <span>چ</span>
                  <span>پ</span>
                  <span className="text-rose-400">ج</span>
                </div>

                {/* Days buttons */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {Array.from({ length: maxDays }, (_, i) => i + 1).map((d) => {
                    const isSelected = d === selectedDay;
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => handleSelectDay(d)}
                        className={`h-8 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center ${
                          isSelected
                            ? (isGirls
                                ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-[0_0_12px_rgba(244,63,94,0.7)] scale-105'
                                : 'bg-gradient-to-r from-cyan-400 to-teal-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.7)] scale-105')
                            : 'hover:bg-white/10 text-slate-200'
                        }`}
                      >
                        {formatToPersianDigits(d)}
                      </button>
                    );
                  })}
                </div>

                {/* Quick birth year presets for students */}
                <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between gap-1 overflow-x-auto text-[10px]">
                  <span className="text-slate-400 whitespace-nowrap text-[9px]">سال‌های متداول:</span>
                  {[1387, 1388, 1389, 1390, 1391].map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => handleQuickPreset(yr)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition ${
                        selectedYear === yr
                          ? (isGirls ? 'bg-pink-500 text-white' : 'bg-cyan-500 text-slate-950 font-bold')
                          : 'bg-white/5 hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      {formatToPersianDigits(yr)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 2: MONTHS SELECTOR */}
            {viewMode === 'months' && (
              <div className="grid grid-cols-3 gap-1.5 py-1">
                {PERSIAN_MONTHS.map((m) => {
                  const isSelected = m.id === selectedMonth;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setSelectedMonth(m.id);
                        setViewMode('days');
                      }}
                      className={`py-2 px-1 rounded-xl text-xs font-bold transition ${
                        isSelected
                          ? (isGirls ? 'bg-pink-500 text-white' : 'bg-cyan-500 text-slate-950')
                          : 'bg-white/5 hover:bg-white/10 text-slate-200'
                      }`}
                    >
                      {m.name}
                    </button>
                  );
                })}
              </div>
            )}

            {/* VIEW 3: YEARS SELECTOR */}
            {viewMode === 'years' && (
              <div className="max-h-48 overflow-y-auto grid grid-cols-3 gap-1.5 py-1 pr-1 custom-scrollbar">
                {yearsList.map((yr) => {
                  const isSelected = yr === selectedYear;
                  return (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => {
                        setSelectedYear(yr);
                        setViewMode('days');
                      }}
                      className={`py-2 px-1 rounded-xl text-xs font-mono font-bold transition ${
                        isSelected
                          ? (isGirls ? 'bg-pink-500 text-white' : 'bg-cyan-500 text-slate-950')
                          : 'bg-white/5 hover:bg-white/10 text-slate-200'
                      }`}
                    >
                      {formatToPersianDigits(yr)}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Bottom Current Selection bar */}
            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
              <div className="text-slate-400 flex items-center gap-1 font-mono">
                <span>انتخاب:</span>
                <span className={isGirls ? 'text-pink-300 font-bold' : 'text-cyan-300 font-bold'}>
                  {formatToPersianDigits(`${selectedYear}/${String(selectedMonth).padStart(2, '0')}/${String(selectedDay).padStart(2, '0')}`)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleSelectDay(selectedDay)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  isGirls
                    ? 'bg-pink-600 hover:bg-pink-500 text-white'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                }`}
              >
                <Check size={13} />
                <span>تایید</span>
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
