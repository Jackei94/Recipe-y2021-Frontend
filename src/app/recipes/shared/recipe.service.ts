import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Recipe} from "../../shared/models/recipe";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(private http: HttpClient) { }

  addRecipe(recipe: Recipe): Observable<boolean>{
    return this.http.post<boolean>(environment.apiUrl + '/recipe/create', recipe);
  }

  uploadImage(file: File): Observable<any>{
    const fd = new FormData();
    fd.append('image', file, file.name);
    return this.http.post<any>('https://us-central1-recipeapp-d80f3.cloudfunctions.net/uploadFile', fd);
  }

  deleteImage(imageToDelete: any): Observable<any>{
    return this.http.post<any>('https://us-central1-recipeapp-d80f3.cloudfunctions.net/deleteFile', imageToDelete);
  }

}
