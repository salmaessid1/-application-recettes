export interface Recipe {
  id: number;
  title: string;
  ingredients: string[];
  instructions: string;
  imageUrl: string;
  category: string;
  rating: number; // Ajoutez cette propriété pour la note
  isFavorite: boolean;
  comments: string[];
}
