import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeAddComponent } from './recipe-add/recipe-add.component';
import {RecipesRoutingModule} from "./recipes-routing.module";
import {SharedModule} from "../shared/shared.module";



@NgModule({
  declarations: [RecipeAddComponent],
  imports: [
    CommonModule,
    RecipesRoutingModule,
    SharedModule
  ]
})

export class RecipesModule { }
