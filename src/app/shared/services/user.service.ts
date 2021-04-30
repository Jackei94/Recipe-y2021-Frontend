import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoginDto} from "../../login/shared/dtos/login.dto";
import {Observable} from "rxjs";
import {User} from "../models/user";
import {environment} from "../../../environments/environment";
import {UserUpdateDto} from "../../profile/shared/dtos/user.update.dto";
import {UserInfoDto} from "../../profile/shared/dtos/user.info.dto";
import {SocketRecipeApp} from "../shared.module";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private socket: SocketRecipeApp) { }

  register(loginDTO: LoginDto): Observable<User>{
    return this.http.post<User>(environment.apiUrl + '/user/register', loginDTO);
  }

  getUserById(ID: number): Observable<User>{
    return this.http.get<User>(environment.apiUrl + `/user/getByID?userID=${ID}`);
  }

  getUsername(ID: number): Observable<UserInfoDto>{
    return this.http.get<UserInfoDto>(environment.apiUrl + `/user/getInfoByID?userID=${ID}`);
  }

  updateUserPassword(userUpdateDTO: UserUpdateDto): Observable<boolean>{
    return this.http.put<boolean>(environment.apiUrl + '/user/updatePassword', userUpdateDTO);
  }

  joinPersonalRoom(userID: number){
    this.socket.emit('joinPersonalRoom', userID);
  }

}
