import {Recipe} from "../../../shared/models/recipe";

export interface RecipeDeleteDto{
  recipe: Recipe
  userID: number
}
