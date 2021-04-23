import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FrontpageComponent} from './frontpage/frontpage.component';
import {LoginComponent} from "./login/login.component";
import {UserAuthGuard} from "./auth-guards/user-auth-guard";
import {RecipeDetailsComponent} from "./recipes/recipe-details/recipe-details.component";

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: FrontpageComponent},
  {path: 'profile', loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule), canActivate: [UserAuthGuard]},
  {path: 'recipe-details', component: RecipeDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
