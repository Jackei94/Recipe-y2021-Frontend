import { Injectable } from '@angular/core';
import {RatingDto} from "./dtos/rating.dto";
import {Observable} from "rxjs";
import {Recipe} from "../../shared/models/recipe";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {SocketRecipeApp} from "../../shared/shared.module";

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  constructor(private http: HttpClient, private socket: SocketRecipeApp) { }

  giveRating(rating: RatingDto): Observable<Recipe>{
    return this.http.post<Recipe>(environment.apiUrl + '/rating/giveRating', rating);
  }

  deleteRating(rating: RatingDto): Observable<Recipe>{

    const options = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      body: rating
    }

    return this.http.delete<Recipe>(environment.apiUrl + '/rating/deleteRating', options);
  }

  listenForRateChange(): Observable<RatingDto>{
    return this.socket.fromEvent<RatingDto>('recipeRatingUpdated');
  }

}
