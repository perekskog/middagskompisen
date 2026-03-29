import React from 'react';
import { RefreshCw } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { useMiddagskompisen } from './hooks/useMiddagskompisen';

// --- Components ---
import { Login } from './components/Login';
import { Header } from './components/Header';
import { Tabs } from './components/Tabs';
import { PlanView } from './components/PlanView';
import { FavoritesView } from './components/FavoritesView';

// --- Main App ---

export default function App() {
  const {
    user,
    loading,
    activeTab,
    setActiveTab,
    favorites,
    generatingDays,
    isAddingFavorite,
    setIsAddingFavorite,
    newFav,
    setNewFav,
    editingFav,
    setEditingFav,
    expandedFavoriteId,
    setExpandedFavoriteId,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    planDates,
    handleLogin,
    handleLogout,
    handleAddFavorite,
    handleUpdateFavorite,
    handleDeleteFavorite,
    handleClearPlans,
    getDayPlan,
    updateDaySettings,
    generateSuggestion
  } = useMiddagskompisen();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F9F7]">
      <RefreshCw className="animate-spin text-gray-400" />
    </div>
  );

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-gray-900 font-sans pb-20">
      <Header onLogout={handleLogout} onClearPlans={handleClearPlans} showClearPlans={activeTab === 'plan'} />

      <main className="max-w-4xl mx-auto px-6 py-8">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <AnimatePresence mode="wait">
          {activeTab === 'plan' ? (
            <PlanView 
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              planDates={planDates}
              getDayPlan={getDayPlan}
              generatingDays={generatingDays}
              favorites={favorites}
              updateDaySettings={updateDaySettings}
              generateSuggestion={generateSuggestion}
            />
          ) : (
            <FavoritesView 
              favorites={favorites}
              isAddingFavorite={isAddingFavorite}
              setIsAddingFavorite={setIsAddingFavorite}
              newFav={newFav}
              setNewFav={setNewFav}
              editingFav={editingFav}
              setEditingFav={setEditingFav}
              expandedFavoriteId={expandedFavoriteId}
              setExpandedFavoriteId={setExpandedFavoriteId}
              handleAddFavorite={handleAddFavorite}
              handleUpdateFavorite={handleUpdateFavorite}
              handleDeleteFavorite={handleDeleteFavorite}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
