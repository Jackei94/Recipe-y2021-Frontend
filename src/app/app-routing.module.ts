import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FrontpageComponent} from "./frontpage/frontpage.component";
import {LoginComponent} from "./login/login.component";

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: FrontpageComponent},
  {path: 'profile', loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
