import React from 'react';
import { Globe, Star, Search, Utensils, ExternalLink, RefreshCw } from 'lucide-react';
import { PlanDay, Category } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { CategoryIcon } from './CategoryIcon';
import { cn } from '../lib/utils';

interface PlanDayCardProps {
  date: string;
  dayPlan: PlanDay | undefined;
  isWeekend: boolean;
  generatingDays: Record<string, boolean>;
  favorites: any[];
  updateDaySettings: (date: string, updates: Partial<PlanDay>) => Promise<void>;
  generateSuggestion: (date: string) => Promise<void>;
}

export const PlanDayCard = ({ 
  date, 
  dayPlan, 
  isWeekend, 
  generatingDays, 
  favorites,
  updateDaySettings, 
  generateSuggestion 
}: PlanDayCardProps) => {
  const d = new Date(date);
  const dayName = d.toLocaleDateString('sv-SE', { weekday: 'long' });

  return (
    <Card className={cn(dayPlan?.complexity === 'ambitiöst' ? "border-orange-100 bg-orange-50/20" : "")}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold uppercase tracking-wider text-gray-400">
              {dayName}
            </span>
            {dayPlan?.complexity === 'ambitiöst' && (
              <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full uppercase">
                Ambitiöst
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold mb-4 capitalize">{date}</h3>
          
          {/* Settings Row */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
              <Globe size={14} className="text-gray-400" />
              <select 
                value={dayPlan?.source || 'web'}
                onChange={(e) => updateDaySettings(date, { source: e.target.value as 'web'|'favorite' })}
                className="bg-transparent text-sm font-medium outline-none cursor-pointer"
              >
                <option value="web">Nätet</option>
                <option value="favorite">Favorit</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
              <CategoryIcon category={dayPlan?.category || 'valfritt'} size={14} />
              <select 
                value={dayPlan?.category || 'valfritt'}
                onChange={(e) => updateDaySettings(date, { category: e.target.value as Category })}
                className="bg-transparent text-sm font-medium outline-none cursor-pointer"
              >
                <option value="valfritt">Valfritt</option>
                <option value="vegetarisk">Vegetarisk</option>
                <option value="kött">Kött</option>
                <option value="fisk">Fisk</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
              <Star size={14} className="text-gray-400" />
              <select 
                value={dayPlan?.complexity || (isWeekend ? 'ambitiöst' : 'enkelt')}
                onChange={(e) => updateDaySettings(date, { complexity: e.target.value as 'enkelt'|'ambitiöst' })}
                className="bg-transparent text-sm font-medium outline-none cursor-pointer"
              >
                <option value="enkelt">Enkelt</option>
                <option value="ambitiöst">Ambitiöst</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 flex-1 min-w-[150px]">
              <Search size={14} className="text-gray-400" />
              <input 
                type="text"
                placeholder="Måste innehålla..."
                value={dayPlan?.requiredIngredient || ''}
                onChange={(e) => updateDaySettings(date, { requiredIngredient: e.target.value })}
                className="bg-transparent text-sm font-medium outline-none w-full"
              />
            </div>
          </div>

          {/* Result */}
          {dayPlan?.recipeTitle ? (
            <div className="flex flex-col gap-2">
              <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                    <Utensils size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold">{dayPlan.recipeTitle}</h4>
                    {dayPlan.recipeUrl && (
                      <a 
                        href={dayPlan.recipeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 flex items-center gap-1 hover:underline"
                      >
                        Visa recept <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => generateSuggestion(date)} 
                  icon={RefreshCw} 
                  loading={generatingDays[date]}
                />
              </div>
              
              {dayPlan.source === 'favorite' && favorites.find(f => f.title === dayPlan.recipeTitle)?.recipe && (
                <div className="px-4 py-3 bg-gray-50/50 rounded-2xl text-sm text-gray-600 whitespace-pre-wrap border border-gray-100/50">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Instruktioner</div>
                  {favorites.find(f => f.title === dayPlan.recipeTitle)?.recipe}
                </div>
              )}
            </div>
          ) : (
            <Button 
              variant="outline" 
              className="w-full py-4 border-dashed" 
              onClick={() => generateSuggestion(date)}
              icon={RefreshCw}
              loading={generatingDays[date]}
            >
              Generera förslag
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
