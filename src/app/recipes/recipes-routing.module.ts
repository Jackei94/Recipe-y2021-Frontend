import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllRecipesComponent} from './all-recipes/all-recipes.component';
import {RecipeDetailsComponent} from "./recipe-details/recipe-details.component";

const routes: Routes = [
  {path: 'all', component: AllRecipesComponent},
  {path: 'details/:id', component: RecipeDetailsComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipesRoutingModule { }
