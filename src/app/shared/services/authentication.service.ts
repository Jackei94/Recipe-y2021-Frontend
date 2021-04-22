import { Injectable } from '@angular/core';
import {LoginDto} from "../../login/shared/dtos/login.dto";
import {Observable} from "rxjs";
import {User} from "../models/user";
import {environment} from "../../../environments/environment";
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {LoginResponseDto} from "../../login/shared/dtos/login.response.dto";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  register(loginDTO: LoginDto): Observable<User>{
    return this.http.post<User>(environment.apiUrl + '/user/register', loginDTO);
  }

  login(loginDTO: LoginDto): Observable<boolean> {
    return this.http.post<LoginResponseDto>(environment.apiUrl + '/user/login', loginDTO)
      .pipe(map((loginResponseDTO) => {
        console.log(loginResponseDTO);
        if (loginResponseDTO !== null) {
          localStorage.setItem('loggedUser', JSON.stringify({token: loginResponseDTO.token}));
          return true;
        } else {
          return false;
        }
      }));
  }

  logout(): void {
    localStorage.removeItem('loggedUser');
  }

  getToken(): string {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    if (loggedUser !== null) {
      return loggedUser.token;
    } else {
      return null;
    }
  }

  validateToken(): boolean{
    const token: string = this.getToken();
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return ((Math.floor((new Date).getTime() / 1000)) <= expiry);
  }

  getUserFromToken(): User{
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    if (loggedUser !== null){

      const userID: number = JSON.parse(atob(loggedUser.token.split('.')[1])).ID;
      const username: string = JSON.parse(atob(loggedUser.token.split('.')[1])).username;

      return {ID: userID, username: username, password: '', salt: ''}
    }
    else{
      return null;
    }
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
