import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RecipesRoutingModule} from './recipes-routing.module';
import {SharedModule} from '../shared/shared.module';
import {AllRecipesComponent} from './all-recipes/all-recipes.component';
import {RecipeDetailsComponent} from './recipe-details/recipe-details.component';



@NgModule({
  declarations: [AllRecipesComponent, RecipeDetailsComponent],
  imports: [
    CommonModule,
    RecipesRoutingModule,
    SharedModule
  ]
})
export class RecipesModule { }
