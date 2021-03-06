import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Recipe} from "../../shared/models/recipe";
import {environment} from "../../../environments/environment";
import {Category} from "../../shared/models/category";
import {RecipeGetDto} from "./dtos/recipe.get.dto";
import {SocketRecipeApp} from "../../shared/shared.module";
import {FilterList} from "../../shared/models/filterList";
import {RecipeDeleteDto} from "./dtos/recipe.delete.dto";
import {FavoriteDto} from './dtos/favorite.dto';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(private http: HttpClient, private socket: SocketRecipeApp) { }

  addRecipe(recipe: Recipe): Observable<Recipe>{
    return this.http.post<Recipe>(environment.apiUrl + '/recipe/create', recipe);
  }

  getRecipes(filter: string): Observable<FilterList<Recipe>>{
    return this.http.get<FilterList<Recipe>>(environment.apiUrl + '/recipe/getRecipes' + filter);
  }

  getPersonalRecipes(filter: string): Observable<FilterList<Recipe>>{
    return this.http.get<FilterList<Recipe>>(environment.apiUrl + '/recipe/getPersonalRecipes' + filter);
  }

  updateRecipe(recipe: Recipe): Observable<Recipe>{
    return this.http.put<Recipe>(environment.apiUrl + '/recipe/update', recipe);
  }

  getRecipeCategories(): Observable<Category[]>{
    return this.http.get<Category[]>(environment.apiUrl + '/recipe/recipeCategories');
  }

  getPersonalRecipeByID(recipeGetDTO: RecipeGetDto): Observable<Recipe>{
    return this.http.post<Recipe>(environment.apiUrl + '/recipe/getPersonalById', recipeGetDTO);
  }

  getRecipeByID(recipeGetDTO: RecipeGetDto): Observable<Recipe>{
    return this.http.post<Recipe>(environment.apiUrl + '/recipe/getById', recipeGetDTO);
  }

  deleteRecipeByID(recipeDeleteDTO: RecipeDeleteDto): Observable<boolean>{

    const options = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      body: recipeDeleteDTO
    }

    return this.http.delete<boolean>(environment.apiUrl + '/recipe/deleteRecipe', options)
  }

  favoriteRecipe(favoriteDTO: FavoriteDto): Observable<boolean>{
    return this.http.post<boolean>(environment.apiUrl + '/recipe/favorite', favoriteDTO);
  }

  unfavoriteRecipe(favoriteDTO: FavoriteDto): Observable<boolean>{

    const options = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      body: favoriteDTO
    }

    return this.http.delete<boolean>(environment.apiUrl + '/recipe/unfavorite', options);
  }

  uploadImage(file: File): Observable<any>{
    const fd = new FormData();
    fd.append('image', file, file.name);
    return this.http.post<any>('https://us-central1-recipeapp-d80f3.cloudfunctions.net/uploadFile', fd);
  }

  deleteImage(imageToDelete: any): Observable<any>{
    return this.http.post<any>('https://us-central1-recipeapp-d80f3.cloudfunctions.net/deleteFile', imageToDelete);
  }



  listenForCreate(): Observable<Recipe>{
    return this.socket.fromEvent<Recipe>('recipeCreated');
  }

  listenForUpdateChange(): Observable<Recipe>{
    return this.socket.fromEvent<Recipe>('recipeUpdated');
  }

  listenForDeleteChange(): Observable<Recipe>{
    return this.socket.fromEvent<Recipe>('recipeDeleted');
  }

  listenForFavoriteUpdate(): Observable<FavoriteDto>{
    return this.socket.fromEvent<FavoriteDto>('recipeFavoriteUpdate');
  }

}
