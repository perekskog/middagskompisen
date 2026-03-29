import React from 'react';
import { cn } from '../lib/utils';

interface TabsProps {
  activeTab: 'plan' | 'favorites';
  setActiveTab: (tab: 'plan' | 'favorites') => void;
}

export function Tabs({ activeTab, setActiveTab }: TabsProps) {
  return (
    <div className="flex gap-2 mb-8 bg-gray-100 p-1.5 rounded-2xl w-fit">
      <button 
        onClick={() => setActiveTab('plan')}
        className={cn(
          "px-6 py-2 rounded-xl text-sm font-medium transition-all",
          activeTab === 'plan' ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-gray-700"
        )}
      >
        Veckoplan
      </button>
      <button 
        onClick={() => setActiveTab('favorites')}
        className={cn(
          "px-6 py-2 rounded-xl text-sm font-medium transition-all",
          activeTab === 'favorites' ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-gray-700"
        )}
      >
        Mina egna recept
      </button>
    </div>
  );
}
