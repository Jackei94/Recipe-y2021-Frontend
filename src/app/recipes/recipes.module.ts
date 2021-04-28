import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RecipesRoutingModule} from './recipes-routing.module';
import {SharedModule} from '../shared/shared.module';
import {AllRecipesComponent} from './all-recipes/all-recipes.component';
import {RecipeDetailsComponent} from './recipe-details/recipe-details.component';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import { MyRecipesComponent } from './my-recipes/my-recipes.component';
import {RatingModule} from 'ngx-bootstrap/rating';


@NgModule({
  declarations: [AllRecipesComponent, RecipeDetailsComponent, MyRecipesComponent],

  imports: [
    CommonModule,
    RecipesRoutingModule,
    SharedModule,
    PaginationModule,
    RatingModule
  ]
})
export class RecipesModule { }
