import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RecipesRoutingModule} from './recipes-routing.module';
import {SharedModule} from '../shared/shared.module';
import {AllRecipesComponent} from './all-recipes/all-recipes.component';
import {RecipeDetailsComponent} from './recipe-details/recipe-details.component';
import {PaginationModule} from 'ngx-bootstrap/pagination';



@NgModule({
  declarations: [AllRecipesComponent, RecipeDetailsComponent],
  imports: [
    CommonModule,
    RecipesRoutingModule,
    SharedModule,
    PaginationModule
  ]
})
export class RecipesModule { }
