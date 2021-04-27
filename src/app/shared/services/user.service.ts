import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoginDto} from "../../login/shared/dtos/login.dto";
import {Observable} from "rxjs";
import {User} from "../models/user";
import {environment} from "../../../environments/environment";
import {UserUpdateDto} from "../../profile/shared/dtos/user.update.dto";
import {UserGetDto} from "../../profile/shared/dtos/user.get.dto";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  register(loginDTO: LoginDto): Observable<User>{
    return this.http.post<User>(environment.apiUrl + '/user/register', loginDTO);
  }

  getUserById(ID: number): Observable<User>{
    return this.http.get<User>(environment.apiUrl + `/user/getByID?userID=${ID}`);
  }

  updateUserPassword(userUpdateDTO: UserUpdateDto): Observable<boolean>{
    return this.http.put<boolean>(environment.apiUrl + '/user/updatePassword', userUpdateDTO);
  }



}
