import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoginDto} from "../../login/shared/dtos/login.dto";
import {Observable} from "rxjs";
import {User} from "../models/user";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  register(loginDTO: LoginDto): Observable<User>{
    return this.http.post<User>(environment.apiUrl + '/user/register', loginDTO);
  }

  login(loginDTO: LoginDto): Observable<User>{
    return this.http.post<User>(environment.apiUrl + '/user/login', loginDTO);
  }

  saveUser(user: User){
    localStorage.setItem('loggedUser', JSON.stringify(user));
  }

  removeUser(){
    localStorage.removeItem('loggedUser');
  }

  getUser(): User{
    return JSON.parse(localStorage.getItem('loggedUser'));
  }

  saveLogin(loginDTO: LoginDto): void{
    localStorage.setItem('loginForm', JSON.stringify(loginDTO));
  }

  forgetLogin(): void{
    localStorage.removeItem('loginForm');
  }

  getLoginInformation(): LoginDto{
    return JSON.parse(localStorage.getItem('loginForm'));
  }

}
