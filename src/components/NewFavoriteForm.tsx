import React from 'react';
import { Plus, Check, X } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { CategoryIcon } from './CategoryIcon';
import { Favorite } from '../types';
import { cn } from '../lib/utils';

interface NewFavoriteFormProps {
  newFav: { title: string; category: Favorite['category']; recipe: string };
  setNewFav: React.Dispatch<React.SetStateAction<{ title: string; category: Favorite['category']; recipe: string }>>;
  onSave: () => void;
  onCancel: () => void;
}

export function NewFavoriteForm({ newFav, setNewFav, onSave, onCancel }: NewFavoriteFormProps) {
  return (
    <Card className="border-black/10 bg-gray-50/50">
      <div className="space-y-4">
        <h3 className="font-bold">Nytt recept</h3>
        <div className="grid gap-4">
          <input 
            type="text" 
            placeholder="Namn på maträtt..."
            value={newFav.title}
            onChange={(e) => setNewFav({ ...newFav, title: e.target.value })}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-black outline-none transition-all"
          />
          <textarea 
            placeholder="Skriv in receptet här (ingredienser, instruktioner...)"
            value={newFav.recipe}
            onChange={(e) => setNewFav({ ...newFav, recipe: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-black outline-none transition-all resize-none"
          />
          <div className="flex gap-2">
            {(['vegetarisk', 'kött', 'fisk'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setNewFav({ ...newFav, category: cat })}
                className={cn(
                  "flex-1 px-4 py-2 rounded-xl text-sm font-medium border transition-all flex items-center justify-center gap-2",
                  newFav.category === cat ? "bg-black text-white border-black" : "bg-white border-gray-200 text-gray-600"
                )}
              >
                <CategoryIcon category={cat} size={14} />
                <span className="capitalize">{cat}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Button className="flex-1" onClick={onSave} icon={Check}>Spara</Button>
          <Button variant="ghost" onClick={onCancel} icon={X}>Avbryt</Button>
        </div>
      </div>
    </Card>
  );
}
