import {User} from "./user";
import {IngredientEntry} from "./ingredient-entry";

export interface Recipe {
  ID: number
  title: string
  description: string
  ingredientEntries: IngredientEntry[]
  preparations: string
  imageURL: string
  user?: User
}
