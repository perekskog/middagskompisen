import React from 'react';
import { Edit2, Trash2, Check, X } from 'lucide-react';
import { motion } from 'motion/react';
import { Favorite } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { CategoryIcon } from './CategoryIcon';

interface FavoriteCardProps {
  fav: Favorite;
  editingFav: Favorite | null;
  expandedFavoriteId: string | null;
  setEditingFav: (fav: Favorite | null) => void;
  setExpandedFavoriteId: (id: string | null) => void;
  handleUpdateFavorite: () => Promise<void>;
  handleDeleteFavorite: (id: string) => Promise<void>;
}

export const FavoriteCard = ({ 
  fav, 
  editingFav, 
  expandedFavoriteId, 
  setEditingFav, 
  setExpandedFavoriteId, 
  handleUpdateFavorite, 
  handleDeleteFavorite 
}: FavoriteCardProps) => {
  return (
    <Card className="p-4 flex flex-col group">
      {editingFav?.id === fav.id ? (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={editingFav.title}
              onChange={(e) => setEditingFav({ ...editingFav, title: e.target.value })}
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 outline-none"
            />
            <select 
              value={editingFav.category}
              onChange={(e) => setEditingFav({ ...editingFav, category: e.target.value as Favorite['category'] })}
              className="px-2 py-2 rounded-xl border border-gray-200"
            >
              <option value="vegetarisk">Veg</option>
              <option value="kött">Kött</option>
              <option value="fisk">Fisk</option>
            </select>
          </div>
          <textarea 
            value={editingFav.recipe || ''}
            onChange={(e) => setEditingFav({ ...editingFav, recipe: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none resize-none"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleUpdateFavorite} icon={Check}>Spara</Button>
            <Button size="sm" variant="ghost" onClick={() => setEditingFav(null)} icon={X}>Avbryt</Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                <CategoryIcon category={fav.category} />
              </div>
              <div className="cursor-pointer" onClick={() => setExpandedFavoriteId(expandedFavoriteId === fav.id ? null : fav.id!)}>
                <h4 className="font-bold flex items-center gap-2">
                  {fav.title}
                  {fav.recipe && <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded uppercase text-gray-500">Recept</span>}
                </h4>
                <p className="text-xs text-gray-500 capitalize">{fav.category}</p>
              </div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm" onClick={() => setEditingFav(fav)} icon={Edit2} />
              <Button variant="danger" size="sm" onClick={() => handleDeleteFavorite(fav.id!)} icon={Trash2} />
            </div>
          </div>
          
          {expandedFavoriteId === fav.id && fav.recipe && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-4 pt-4 border-t border-gray-50 text-sm text-gray-600 whitespace-pre-wrap"
            >
              {fav.recipe}
            </motion.div>
          )}
        </>
      )}
    </Card>
  );
};
