import React, { useState, useEffect } from 'react';
import styles from './Calendar.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isBefore,
  isWithinInterval,
} from 'date-fns';

interface CalendarProps {
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  selectedRange: { start: Date | null; end: Date | null };
  setSelectedRange: React.Dispatch<React.SetStateAction<{ start: Date | null; end: Date | null }>>;
}

const FESTIVALS: Record<string, { name: string; color: string }> = {
  '01-01': { name: "New Year's Day", color: '#FFD700' },
  '02-14': { name: "Valentine's Day", color: '#FF69B4' },
  '12-25': { name: "Christmas", color: '#10B981' },
  '10-31': { name: "Halloween", color: '#F59E0B' },
  '11-12': { name: "Diwali", color: '#FCD34D' },
};

const MOODS = ['😁', '😊', '😐', '😔', '😫'];

const Calendar: React.FC<CalendarProps> = ({ currentDate, setCurrentDate, selectedRange, setSelectedRange }) => {
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [direction, setDirection] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [moodsDict, setMoodsDict] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadedMoods: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('calendar_mood_')) {
            loadedMoods[key] = localStorage.getItem(key) || '';
        }
    }
    setMoodsDict(loadedMoods);
  }, []);

  useEffect(() => {
    const handlePointerUp = () => setIsDragging(false);
    window.addEventListener('pointerup', handlePointerUp);
    return () => window.removeEventListener('pointerup', handlePointerUp);
  }, []);

  const handlePrevMonth = () => {
    setDirection(-1);
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setDirection(1);
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handlePointerDown = (date: Date, e: React.PointerEvent) => {
    if (e.target instanceof Element) {
      e.target.releasePointerCapture(e.pointerId);
    }
    setIsDragging(true);
    setSelectedRange({ start: date, end: null });
    setHoverDate(null);
  };

  const handlePointerEnter = (date: Date) => {
    if (isDragging && selectedRange.start) {
      if (isSameDay(date, selectedRange.start)) {
        setSelectedRange({ start: selectedRange.start, end: null });
      } else if (isBefore(date, selectedRange.start)) {
        setSelectedRange({ start: date, end: selectedRange.start });
      } else {
        setSelectedRange({ start: selectedRange.start, end: date });
      }
    } else if (selectedRange.start && !selectedRange.end && !isDragging) {
      setHoverDate(date);
    }

    const festKey = format(date, 'MM-dd');
    if (FESTIVALS[festKey]) {
    }
  };

  const handlePointerUpLocal = (date: Date) => {
    if (isDragging && selectedRange.start) {
      setIsDragging(false);
      if (!selectedRange.end && !isSameDay(date, selectedRange.start)) {
        if (isBefore(date, selectedRange.start)) {
          setSelectedRange({ start: date, end: selectedRange.start });
        } else {
          setSelectedRange({ start: selectedRange.start, end: date });
        }
      }
    }
  };

  const handleMouseLeaveGrid = () => {
    if (!isDragging) {
      setHoverDate(null);
    }
  };

  const hasNote = (day: Date) => {
    const key = `calendar_notes_${format(day, 'yyyy-MM-dd')}`;
    return !!localStorage.getItem(key);
  };

  const getMood = (day: Date) => {
      return moodsDict[`calendar_mood_${format(day, 'yyyy-MM-dd')}`];
  };

  const handleMoodSelect = (mood: string) => {
      if (selectedRange.start) {
          const key = `calendar_mood_${format(selectedRange.start, 'yyyy-MM-dd')}`;
          localStorage.setItem(key, mood);
          setMoodsDict(prev => ({...prev, [key]: mood}));
      }
  };

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const getDayInfo = (day: Date) => {
    const isStart = selectedRange.start && isSameDay(day, selectedRange.start);
    const isEnd = selectedRange.end && isSameDay(day, selectedRange.end);

    let inRange = false;
    let isPreview = false;

    if (selectedRange.start && selectedRange.end) {
      inRange = isWithinInterval(day, { start: selectedRange.start, end: selectedRange.end });
    } else if (selectedRange.start && hoverDate && !isDragging) {
      const rangeStart = isBefore(hoverDate, selectedRange.start) ? hoverDate : selectedRange.start;
      const rangeEnd = isBefore(hoverDate, selectedRange.start) ? selectedRange.start : hoverDate;
      inRange = isWithinInterval(day, { start: rangeStart, end: rangeEnd });
      isPreview = true;
    }

    return {
      isStart,
      isEnd,
      inRange,
      isPreview,
      isSelectedDay: isStart || isEnd || (inRange && isSameDay(day, selectedRange.start!))
    };
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '15%' : '-15%',
      opacity: 0,
      scale: 0.95,
      filter: 'blur(4px)'
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)'
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '15%' : '-15%',
      opacity: 0,
      scale: 0.95,
      filter: 'blur(4px)'
    })
  };

  return (
    <div className={styles.calendar}>
      <header className={styles.header}>
        <div className={styles.monthYear}>
          <h2>{format(currentDate, 'MMMM')}</h2>
          <span>{format(currentDate, 'yyyy')}</span>
        </div>
        <div className={styles.navButtons}>
          <button onClick={() => setCurrentDate(new Date())} className={styles.todayBtn}>
            Today
          </button>
          <button onClick={handlePrevMonth} className={styles.navBtn} aria-label="Previous month">
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
          <button onClick={handleNextMonth} className={styles.navBtn} aria-label="Next month">
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>
        </div>
      </header>

      <div className={styles.weekDays}>
        {daysOfWeek.map(day => (
          <div key={day} className={styles.weekDay}>{day}</div>
        ))}
      </div>

      <div className={styles.gridContainer} onPointerLeave={handleMouseLeaveGrid}>
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentDate.toString()}
            className={styles.daysGrid}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 },
              scale: { duration: 0.3 },
              filter: { duration: 0.3 }
            }}
          >
            {calendarDays.map((day, index) => {
              const { isStart, isEnd, inRange, isPreview, isSelectedDay } = getDayInfo(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isToday = isSameDay(day, new Date());
              const isWeekend = day.getDay() === 0 || day.getDay() === 6;
              const festData = FESTIVALS[format(day, 'MM-dd')];
              const cellMood = getMood(day);

              const rangeClass = clsx(styles.rangeBg, {
                [styles.rangeStart]: isStart || (inRange && index % 7 === 0),
                [styles.rangeEnd]: isEnd || (inRange && index % 7 === 6)
              });

              return (
                <div
                  key={day.toISOString()}
                  className={styles.dayWrapper}
                  onPointerDown={(e) => handlePointerDown(day, e)}
                  onPointerEnter={() => handlePointerEnter(day)}
                  onPointerUp={() => handlePointerUpLocal(day)}
                >
                  {inRange && !isStart && !isEnd && (
                    <motion.div
                      layoutId={`rangeBg-${day.getTime()}`}
                      className={rangeClass}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isPreview ? 0.5 : 1 }}
                      transition={{ duration: 0.15 }}
                    />
                  )}

                  {(isStart || isEnd) && (
                    <motion.div
                      layoutId={isStart ? 'highlight-start' : 'highlight-end'}
                      className={styles.highlightBg}
                      transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    />
                  )}

                  {!inRange && !isStart && !isEnd && hoverDate && isSameDay(day, hoverDate) && (
                    <motion.div
                      layoutId="hover-ghost"
                      className={styles.hoverBg}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}

                  <motion.div
                    className={clsx(styles.dayContent, {
                      [styles.currentMonth]: isCurrentMonth,
                      [styles.otherMonth]: !isCurrentMonth,
                      [styles.weekend]: isWeekend && isCurrentMonth && !inRange && !isSelectedDay,
                      [styles.selectedText]: isSelectedDay,
                      [styles.inRangeText]: inRange && !isStart && !isEnd,
                      [styles.today]: isToday && !isSelectedDay && !inRange,
                      [styles.hasMood]: !!cellMood,
                    })}
                    whileHover={{ scale: isSelectedDay ? 1 : 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    {!cellMood ? <span>{format(day, 'd')}</span> : <span className={styles.moodEmoji}>{cellMood}</span>}

                    <div className={styles.indicatorsTrack}>
                        {festData && (
                            <div className={styles.festivalIndicator} style={{backgroundColor: festData.color}}>
                                <div className={styles.festTooltip}>{festData.name}</div>
                            </div>
                        )}
                        {hasNote(day) && <div className={styles.noteIndicatorDot} />}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
          {selectedRange.start && (!selectedRange.end || isSameDay(selectedRange.start, selectedRange.end)) && (
              <motion.div 
                className={styles.moodPickerContainer}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                  <span>Log Mood:</span>
                  {MOODS.map(m => (
                      <button key={m} className={styles.moodBtn} onClick={() => handleMoodSelect(m)}>
                          {m}
                      </button>
                  ))}
              </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
};

export default Calendar;
