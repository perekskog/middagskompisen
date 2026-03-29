import React from 'react';
import { motion } from 'motion/react';
import { Plus, Star } from 'lucide-react';
import { Button } from './ui/Button';
import { FavoriteCard } from './FavoriteCard';
import { NewFavoriteForm } from './NewFavoriteForm';
import { Favorite } from '../types';

interface FavoritesViewProps {
  favorites: Favorite[];
  isAddingFavorite: boolean;
  setIsAddingFavorite: (val: boolean) => void;
  newFav: { title: string; category: Favorite['category']; recipe: string };
  setNewFav: React.Dispatch<React.SetStateAction<{ title: string; category: Favorite['category']; recipe: string }>>;
  editingFav: Favorite | null;
  setEditingFav: (fav: Favorite | null) => void;
  expandedFavoriteId: string | null;
  setExpandedFavoriteId: (id: string | null) => void;
  handleAddFavorite: () => Promise<void>;
  handleUpdateFavorite: () => Promise<void>;
  handleDeleteFavorite: (id: string) => Promise<void>;
}

export function FavoritesView({
  favorites, isAddingFavorite, setIsAddingFavorite, newFav, setNewFav,
  editingFav, setEditingFav, expandedFavoriteId, setExpandedFavoriteId,
  handleAddFavorite, handleUpdateFavorite, handleDeleteFavorite
}: FavoritesViewProps) {
  return (
    <motion.div 
      key="favorites"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mina egna recept</h2>
        <Button onClick={() => setIsAddingFavorite(true)} icon={Plus}>Lägg till</Button>
      </div>

      {isAddingFavorite && (
        <NewFavoriteForm 
          newFav={newFav}
          setNewFav={setNewFav}
          onSave={handleAddFavorite}
          onCancel={() => setIsAddingFavorite(false)}
        />
      )}

      <div className="grid gap-3">
        {favorites.length === 0 && !isAddingFavorite && (
          <div className="text-center py-20 text-gray-400">
            <Star size={40} className="mx-auto mb-4 opacity-20" />
            <p>Du har inga sparade recept än.</p>
          </div>
        )}
        {favorites.map(fav => (
          <FavoriteCard 
            key={fav.id}
            fav={fav}
            editingFav={editingFav}
            expandedFavoriteId={expandedFavoriteId}
            setEditingFav={setEditingFav}
            setExpandedFavoriteId={setExpandedFavoriteId}
            handleUpdateFavorite={handleUpdateFavorite}
            handleDeleteFavorite={handleDeleteFavorite}
          />
        ))}
      </div>
    </motion.div>
  );
}
