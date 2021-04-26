import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeAddComponent } from './recipe-add/recipe-add.component';
import {PersonalRoutingModule} from "./personal-routing.module";
import {SharedModule} from "../../shared/shared.module";
import { RecipeDetailsComponent } from '../recipe-details/recipe-details.component';
import { RecipeUpdateComponent } from './recipe-update/recipe-update.component';


@NgModule({
  declarations: [RecipeAddComponent, RecipeUpdateComponent, RecipeDetailsComponent],
  imports: [
    CommonModule,
    PersonalRoutingModule,
    SharedModule
  ]
})

export class PersonalModule { }
