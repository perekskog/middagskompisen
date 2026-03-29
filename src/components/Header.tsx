import React, { useState, useEffect } from 'react';
import { RefreshCw, LogOut, Trash2, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';

interface HeaderProps {
  onLogout: () => void;
  onClearPlans: () => void;
  showClearPlans: boolean;
}

export function Header({ onLogout, onClearPlans, showClearPlans }: HeaderProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  // Reset confirmation state if we switch tabs
  useEffect(() => {
    if (!showClearPlans) {
      setIsConfirming(false);
    }
  }, [showClearPlans]);

  const handleClearClick = () => {
    if (isConfirming) {
      onClearPlans();
      setIsConfirming(false);
    } else {
      setIsConfirming(true);
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-[#F9F9F7]/80 backdrop-blur-md border-bottom border-gray-100 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
          <RefreshCw size={20} className="text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">Middagskompisen</h1>
      </div>
      <div className="flex items-center gap-2">
        {showClearPlans && (
          <div className="flex items-center gap-2">
            {isConfirming && (
              <span className="text-xs font-medium text-red-500 flex items-center gap-1 animate-pulse">
                <AlertCircle size={12} />
                Är du säker?
              </span>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearClick} 
              icon={isConfirming ? undefined : Trash2} 
              className={isConfirming ? "bg-red-500 text-white hover:bg-red-600" : "text-red-500 hover:text-red-600 hover:bg-red-50"}
            >
              {isConfirming ? "Ja, rensa allt" : "Rensa planering"}
            </Button>
            {isConfirming && (
              <Button variant="ghost" size="sm" onClick={() => setIsConfirming(false)}>
                Avbryt
              </Button>
            )}
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={onLogout} icon={LogOut}>
          Logga ut
        </Button>
      </div>
    </header>
  );
}
