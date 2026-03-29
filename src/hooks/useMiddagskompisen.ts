import { useState, useEffect } from 'react';
import { 
  collection, query, where, onSnapshot, addDoc, 
  updateDoc, deleteDoc, doc
} from 'firebase/firestore';
import { db } from '../firebase';
import { Favorite, PlanDay, Category } from '../types';
import { generateRecipeSuggestion } from '../services/gemini';
import { getInitialDates, getPlanDates } from '../lib/dateUtils';

export function useMiddagskompisen() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'plan' | 'favorites'>('plan');
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [plans, setPlans] = useState<PlanDay[]>([]);
  const [generatingDays, setGeneratingDays] = useState<Record<string, boolean>>({});
  const [isAddingFavorite, setIsAddingFavorite] = useState(false);
  const [newFav, setNewFav] = useState({ title: '', category: 'vegetarisk' as Favorite['category'], recipe: '' });
  const [editingFav, setEditingFav] = useState<Favorite | null>(null);
  const [expandedFavoriteId, setExpandedFavoriteId] = useState<string | null>(null);

  // Date range state
  const initialDates = getInitialDates();
  const [startDate, setStartDate] = useState(initialDates.start);
  const [endDate, setEndDate] = useState(initialDates.end);

  // Auth
  useEffect(() => {
    const savedUser = localStorage.getItem('middagskompisen_user');
    if (savedUser) {
      setUser({ username: savedUser });
    }
    setLoading(false);
  }, []);

  // Data
  useEffect(() => {
    if (!user) return;

    const favQuery = query(collection(db, 'favorites'), where('userId', '==', user.username));
    const unsubFav = onSnapshot(favQuery, (snap) => {
      setFavorites(snap.docs.map(d => ({ id: d.id, ...d.data() } as Favorite)));
    });

    const planQuery = query(collection(db, 'plans'), where('userId', '==', user.username));
    const unsubPlan = onSnapshot(planQuery, (snap) => {
      setPlans(snap.docs.map(d => ({ id: d.id, ...d.data() } as PlanDay)));
    });

    return () => {
      unsubFav();
      unsubPlan();
    };
  }, [user]);

  const handleLogin = (username: string) => {
    setUser({ username });
    localStorage.setItem('middagskompisen_user', username);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('middagskompisen_user');
  };

  const planDates = getPlanDates(startDate, endDate);

  const handleAddFavorite = async () => {
    if (!user || !newFav.title) return;
    await addDoc(collection(db, 'favorites'), {
      ...newFav,
      userId: user.username
    });
    setNewFav({ title: '', category: 'vegetarisk', recipe: '' });
    setIsAddingFavorite(false);
  };

  const handleUpdateFavorite = async () => {
    if (!editingFav || !editingFav.id) return;
    await updateDoc(doc(db, 'favorites', editingFav.id), {
      title: editingFav.title,
      category: editingFav.category,
      recipe: editingFav.recipe || ''
    });
    setEditingFav(null);
  };

  const handleDeleteFavorite = async (id: string) => {
    await deleteDoc(doc(db, 'favorites', id));
  };

  const handleClearPlans = async () => {
    if (!user) return;
    
    try {
      const deletePromises = plans.map(plan => {
        if (plan.id) {
          return deleteDoc(doc(db, 'plans', plan.id));
        }
        return Promise.resolve();
      });
      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error clearing plans:", error);
    }
  };

  const getDayPlan = (date: string) => plans.find(p => p.date === date);

  const updateDaySettings = async (date: string, updates: Partial<PlanDay>) => {
    if (!user) return;
    const existing = getDayPlan(date);
    const d = new Date(date);
    const isWeekend = [0, 5, 6].includes(d.getDay());

    if (existing && existing.id) {
      await updateDoc(doc(db, 'plans', existing.id), updates);
    } else {
      await addDoc(collection(db, 'plans'), {
        userId: user.username,
        date,
        source: 'web',
        category: 'valfritt',
        complexity: isWeekend ? 'ambitiöst' : 'enkelt',
        ...updates
      });
    }
  };

  const generateSuggestion = async (date: string) => {
    if (!user) return;
    setGeneratingDays(prev => ({ ...prev, [date]: true }));
    try {
      const d = new Date(date);
      const isWeekend = [0, 5, 6].includes(d.getDay());
      const day = getDayPlan(date) || { source: 'web' as const, category: 'valfritt' as Category, complexity: isWeekend ? 'ambitiöst' as const : 'enkelt' as const, requiredIngredient: '' };
      
      // Get all recipes already in the current plan range to avoid duplicates
      const currentPlannedRecipes = plans
        .filter(p => planDates.includes(p.date) && p.date !== date && p.recipeTitle)
        .map(p => p.recipeTitle as string);

      if (day.source === 'favorite') {
        const filteredFavs = favorites.filter(f => {
          const isCorrectCategory = day.category === 'valfritt' || f.category === day.category;
          const isNotAlreadyPlanned = !currentPlannedRecipes.includes(f.title);
          return isCorrectCategory && isNotAlreadyPlanned;
        });

        if (filteredFavs.length === 0) {
          alert("Inga unika favoriter hittades i den här kategorin för den här perioden.");
          return;
        }
        const randomFav = filteredFavs[Math.floor(Math.random() * filteredFavs.length)];
        await updateDaySettings(date, { recipeTitle: randomFav.title, recipeUrl: '' });
      } else {
        // Web suggestion
        const suggestion = await generateRecipeSuggestion(
          day.category || 'valfritt', 
          favorites.map(f => f.title),
          date,
          day.complexity || (isWeekend ? 'ambitiöst' : 'enkelt'),
          currentPlannedRecipes,
          day.requiredIngredient
        );
        if (suggestion) {
          await updateDaySettings(date, { 
            recipeTitle: suggestion.title, 
            recipeUrl: suggestion.url 
          });
        }
      }
    } finally {
      setGeneratingDays(prev => ({ ...prev, [date]: false }));
    }
  };

  return {
    user,
    loading,
    activeTab,
    setActiveTab,
    favorites,
    plans,
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
  };
}
