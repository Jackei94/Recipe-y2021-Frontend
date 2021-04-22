import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Select, Store} from "@ngxs/store";
import {LoginState} from "../login/shared/state/login.state";
import {Observable} from "rxjs";
import {User} from "../shared/models/user";
import {map, take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})

export class UserAuthGuard implements CanActivate{

  @Select(LoginState.user)
  loggedUser$: Observable<User>;

  constructor(private router: Router, private store: Store) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.loggedUser$.pipe(map((user) => {if(user != null){return true;}else{this.router.navigate(['/login']); return false;}}))


  }




}
