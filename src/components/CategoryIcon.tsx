import React from 'react';
import { Leaf, Utensils, Fish, HelpCircle } from 'lucide-react';
import { Category } from '../types';

interface CategoryIconProps {
  category: Category;
  size?: number;
}

export const CategoryIcon = ({ category, size = 18 }: CategoryIconProps) => {
  switch (category) {
    case 'vegetarisk': return <Leaf size={size} className="text-green-500" />;
    case 'kött': return <Utensils size={size} className="text-orange-500" />;
    case 'fisk': return <Fish size={size} className="text-blue-500" />;
    default: return <HelpCircle size={size} className="text-gray-400" />;
  }
};
