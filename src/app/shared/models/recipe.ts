import {User} from "./user";
import {IngredientEntry} from "./ingredient-entry";
import {Category} from "./category";

export interface Recipe {
  ID: number
  title: string
  description: string
  ingredientEntries: IngredientEntry[]
  preparations: string
  imageURL: string
  category: Category
  user?: User
}
