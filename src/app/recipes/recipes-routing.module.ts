import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllRecipesComponent} from './all-recipes/all-recipes.component';
import {RecipeDetailsComponent} from "./recipe-details/recipe-details.component";
import {MyRecipesComponent} from './my-recipes/my-recipes.component';

const routes: Routes = [
  {path: 'all', component: AllRecipesComponent},
  {path: 'my', component: MyRecipesComponent},
  {path: 'my/:id', component: MyRecipesComponent},
  {path: 'details/:id', component: RecipeDetailsComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipesRoutingModule { }
