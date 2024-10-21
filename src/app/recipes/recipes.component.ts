// src/app/recipes/recipes.component.ts
import { Component } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent {
  recipes: Recipe[] = [];
  title: string = '';
  ingredients: string = '';
  instructions: string = '';
  imageUrl: string = '';
  category: string = '';
  currentRecipeId: number | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  searchTerm: string = '';
  page: number = 1;
  pageSize: number = 5;
  rating: number | null = null;
  newComment: string = '';
  sortBy: string = 'rating'; // 'rating' ou 'date'

  constructor(private recipeService: RecipeService) {
    this.loadRecipes();
  }

  loadRecipes() {
    this.recipes = this.recipeService.getRecipes();
  }

  addOrUpdateRecipe() {
    if (!this.title || !this.ingredients || !this.instructions || !this.imageUrl || !this.category) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    const ingredientList = this.ingredients.split(',').map(ingredient => ingredient.trim());

    if (this.currentRecipeId !== null) {
      this.recipeService.updateRecipe({
        id: this.currentRecipeId,
        title: this.title,
        ingredients: ingredientList,
        instructions: this.instructions,
        imageUrl: this.imageUrl,
        rating: 0,
        isFavorite: false,
        category: this.category,
        comments: []
      });
      this.currentRecipeId = null; // Réinitialiser l'ID après la mise à jour
      this.successMessage = 'Recette mise à jour avec succès!';
    } else {
      this.recipeService.addRecipe({
        title: this.title,
        ingredients: ingredientList,
        instructions: this.instructions,
        imageUrl: this.imageUrl,
        category: this.category
      });
      this.successMessage = 'Recette ajoutée avec succès!';
    }

    this.resetForm();
    this.loadRecipes();
  }

  editRecipe(recipe: Recipe) {
    this.title = recipe.title;
    this.ingredients = recipe.ingredients.join(', ');
    this.instructions = recipe.instructions;
    this.imageUrl = recipe.imageUrl;
    this.category = recipe.category;
    this.currentRecipeId = recipe.id;
    this.rating = recipe.rating; // Charger la note actuelle
  }

  deleteRecipe(id: number) {
    this.recipeService.deleteRecipe(id);
    this.loadRecipes();
    this.successMessage = 'Recette supprimée avec succès!';
  }

  resetForm() {
    this.title = '';
    this.ingredients = '';
    this.instructions = '';
    this.imageUrl = '';
    this.category = '';
    this.errorMessage = '';
    this.rating = null; // Réinitialiser la note
  }

  filterRecipes() {
    return this.recipes.filter(recipe => recipe.title.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  sortRecipes(recipes: Recipe[]): Recipe[] {
    return recipes.sort((a, b) => {
      if (this.sortBy === 'rating') {
        return b.rating - a.rating;
      }
      return a.id - b.id; // Tri par date d’ajout
    });
  }

  get paginatedRecipes() {
    const startIndex = (this.page - 1) * this.pageSize;
    return this.sortRecipes(this.filterRecipes()).slice(startIndex, startIndex + this.pageSize);
  }

  changePage(page: number) {
    this.page = page;
  }

  toggleFavorite(recipe: Recipe) {
    this.recipeService.toggleFavorite(recipe.id);
    this.loadRecipes(); // Recharger les recettes pour mettre à jour l'affichage
  }

  rateRecipe(recipe: Recipe, rating: number) {
    this.recipeService.rateRecipe(recipe.id, rating);
    this.loadRecipes(); // Recharger les recettes pour mettre à jour l'affichage
  }

  addComment(recipe: Recipe) {
    if (this.newComment) {
      this.recipeService.addComment(recipe.id, this.newComment);
      this.newComment = '';
      this.loadRecipes(); // Recharger pour afficher le nouveau commentaire
    }
  }
}
