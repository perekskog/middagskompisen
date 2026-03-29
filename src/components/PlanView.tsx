import React from 'react';
import { motion } from 'motion/react';
import { PlanDayCard } from './PlanDayCard';
import { Favorite, PlanDay } from '../types';

interface PlanViewProps {
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  planDates: string[];
  getDayPlan: (date: string) => PlanDay | undefined;
  generatingDays: Record<string, boolean>;
  favorites: Favorite[];
  updateDaySettings: (date: string, updates: Partial<PlanDay>) => Promise<void>;
  generateSuggestion: (date: string) => Promise<void>;
}

export function PlanView({ 
  startDate, setStartDate, endDate, setEndDate, planDates, 
  getDayPlan, generatingDays, favorites, updateDaySettings, generateSuggestion 
}: PlanViewProps) {
  return (
    <motion.div 
      key="plan"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Planera Middagar</h2>
        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 px-3">
            <span className="text-xs font-bold text-gray-400 uppercase">Från</span>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-sm font-medium outline-none bg-transparent"
            />
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-2 px-3">
            <span className="text-xs font-bold text-gray-400 uppercase">Till</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-sm font-medium outline-none bg-transparent"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {planDates.map((date) => {
          const dayPlan = getDayPlan(date);
          const d = new Date(date);
          const isWeekend = d.getDay() === 0 || d.getDay() === 6 || d.getDay() === 5; // Fre, Lör, Sön

          return (
            <PlanDayCard 
              key={date}
              date={date}
              dayPlan={dayPlan}
              isWeekend={isWeekend}
              generatingDays={generatingDays}
              favorites={favorites}
              updateDaySettings={updateDaySettings}
              generateSuggestion={generateSuggestion}
            />
          );
        })}
      </div>
    </motion.div>
  );
}
