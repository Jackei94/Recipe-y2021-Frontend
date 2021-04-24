import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Recipe} from "../../shared/models/recipe";
import {environment} from "../../../environments/environment";
import {Category} from "../../shared/models/category";
import {RecipeGetDto} from "./dtos/recipe.get.dto";
import {ListenDetailsDto} from "./dtos/listen.details.dto";
import {Socket} from "ngx-socket-io";
import {SocketRecipeApp} from "../../shared/shared.module";

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(private http: HttpClient, private socket: SocketRecipeApp) { }

  addRecipe(recipe: Recipe): Observable<Recipe>{
    return this.http.post<Recipe>(environment.apiUrl + '/recipe/create', recipe);
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
    return this.http.post<Recipe>(environment.apiUrl + '/recipe/geById', recipeGetDTO);
  }

  uploadImage(file: File): Observable<any>{
    const fd = new FormData();
    fd.append('image', file, file.name);
    return this.http.post<any>('https://us-central1-recipeapp-d80f3.cloudfunctions.net/uploadFile', fd);
  }

  deleteImage(imageToDelete: any): Observable<any>{
    return this.http.post<any>('https://us-central1-recipeapp-d80f3.cloudfunctions.net/deleteFile', imageToDelete);
  }



  listenForUpdateChange(): Observable<Recipe>{
    return this.socket.fromEvent<Recipe>('recipeUpdated');
  }

  joinDetailsRoom(ID: string): void{
    const listenDetailsDTO: ListenDetailsDto = {ID: ID, room: 'details'}
    this.socket.emit('joinDetailsRoom', listenDetailsDTO);
  }

  emitRecipeUpdate(recipe: Recipe): void{
    this.socket.emit('updateRecipe', recipe);
  }

}
