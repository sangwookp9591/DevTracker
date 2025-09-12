import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import { ko } from 'date-fns/locale';

export const getCurrentWeekRange = (): { start: Date; end: Date } => {
  const now = new Date();
  return {
    start: startOfWeek(now, { weekStartsOn: 1 }), // Monday
    end: endOfWeek(now, { weekStartsOn: 1 }),
  };
};

export const getCurrentMonthRange = (): { start: Date; end: Date } => {
  const now = new Date();
  return {
    start: startOfMonth(now),
    end: endOfMonth(now),
  };
};

export const formatDateRange = (start: Date, end: Date): string => {
  return `${format(start, 'M/d', { locale: ko })} - ${format(end, 'M/d', {
    locale: ko,
  })}`;
};

export const getWeekDays = (): string[] => {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const days = [];

  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    days.push(format(day, 'E', { locale: ko }));
  }

  return days;
};

export const calculateWorkingHours = (
  entries: Array<{
    startTime: string;
    endTime?: string;
    durationMinutes?: number;
  }>,
): number => {
  return (
    entries.reduce((total, entry) => {
      if (entry.durationMinutes) {
        return total + entry.durationMinutes;
      }

      if (entry.startTime && entry.endTime) {
        const start = new Date(entry.startTime);
        const end = new Date(entry.endTime);
        return total + (end.getTime() - start.getTime()) / (1000 * 60);
      }

      return total;
    }, 0) / 60
  ); // Convert to hours
};

export const isToday = (date: string | Date): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();

  return d.toDateString() === today.toDateString();
};

export const isThisWeek = (date: string | Date): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const { start, end } = getCurrentWeekRange();

  return d >= start && d <= end;
};

export const isThisMonth = (date: string | Date): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const { start, end } = getCurrentMonthRange();

  return d >= start && d <= end;
};

// 포모도로 타이머 관련 유틸리티
export const formatPomodoroTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
};

export const getPomodoroPhase = (
  sessionCount: number,
  longBreakInterval: number = 4,
): 'work' | 'shortBreak' | 'longBreak' => {
  if (sessionCount % longBreakInterval === 0 && sessionCount > 0) {
    return 'longBreak';
  }

  return sessionCount % 2 === 0 ? 'work' : 'shortBreak';
};
