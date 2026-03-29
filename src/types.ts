export type Category = 'vegetarisk' | 'kött' | 'fisk' | 'valfritt';

export interface Favorite {
  id?: string;
  title: string;
  category: 'vegetarisk' | 'kött' | 'fisk';
  userId: string;
  recipe?: string;
}

export interface PlanDay {
  id?: string;
  userId: string;
  date: string; // YYYY-MM-DD
  source: 'web' | 'favorite';
  category: Category;
  complexity: 'enkelt' | 'ambitiöst';
  recipeTitle?: string;
  recipeUrl?: string;
  requiredIngredient?: string;
}
