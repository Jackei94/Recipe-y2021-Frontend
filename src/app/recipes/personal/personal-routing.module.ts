import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RecipeAddComponent} from "./recipe-add/recipe-add.component";
import {RecipeUpdateComponent} from "./recipe-update/recipe-update.component";
import {ProfileComponent} from "../../profile/profile.component";


const routes: Routes = [
  { path: 'create', component: RecipeAddComponent },
  { path: 'update/:id', component: RecipeUpdateComponent },
  { path: 'settings', component: ProfileComponent }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalRoutingModule { }
