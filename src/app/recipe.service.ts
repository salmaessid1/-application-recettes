// src/app/recipe.service.ts
import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private recipes: Recipe[] = [];
  private nextId: number = 1;

  getRecipes(): Recipe[] {
    return this.recipes;
  }

  addRecipe(recipe: Omit<Recipe, 'id' | 'rating' | 'isFavorite' | 'comments'>): void {
    this.recipes.push({ id: this.nextId++, rating: 0, isFavorite: false, comments: [], ...recipe });
  }

  deleteRecipe(id: number): void {
    this.recipes = this.recipes.filter(recipe => recipe.id !== id);
  }

  updateRecipe(updatedRecipe: Recipe): void {
    const index = this.recipes.findIndex(recipe => recipe.id === updatedRecipe.id);
    if (index !== -1) {
      this.recipes[index] = updatedRecipe;
    }
  }

  toggleFavorite(id: number): void {
    const recipe = this.recipes.find(recipe => recipe.id === id);
    if (recipe) {
      recipe.isFavorite = !recipe.isFavorite;
    }
  }

  rateRecipe(id: number, rating: number): void {
    const recipe = this.recipes.find(recipe => recipe.id === id);
    if (recipe) {
      recipe.rating = rating;
    }
  }

  addComment(id: number, comment: string): void {
    const recipe = this.recipes.find(recipe => recipe.id === id);
    if (recipe) {
      recipe.comments.push(comment);
    }
  }

  getCategories(): string[] {
    return Array.from(new Set(this.recipes.map(recipe => recipe.category)));
  }
}
