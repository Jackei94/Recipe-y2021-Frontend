import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RecipeAddComponent} from "./recipe-add/recipe-add.component";


const routes: Routes = [{ path: 'create', component: RecipeAddComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipesRoutingModule { }
