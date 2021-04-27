import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeAddComponent } from './recipe-add/recipe-add.component';
import {PersonalRoutingModule} from "./personal-routing.module";
import {SharedModule} from "../../shared/shared.module";
import { RecipeUpdateComponent } from './recipe-update/recipe-update.component';
import {ProfileComponent} from "../../profile/profile.component";


@NgModule({
  declarations: [RecipeAddComponent, RecipeUpdateComponent, ProfileComponent],
  imports: [
    CommonModule,
    PersonalRoutingModule,
    SharedModule
  ]
})

export class PersonalModule { }
