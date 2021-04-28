import { Component, OnInit } from '@angular/core';
import {Select, State, Store} from "@ngxs/store";
import {LoginState} from "../../login/shared/state/login.state";
import {Observable} from "rxjs";
import {User} from "../../shared/models/user";
import {LoadUserFromStorage} from "../../login/shared/state/login.actions";
import {faBars} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  profileOpen: boolean = false;

  @Select(LoginState.user)
  loggedUser$: Observable<User> | undefined;

  menuIcon = faBars;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new LoadUserFromStorage());
  }

  outsideClick(): void{
    this.profileOpen = false;
  }
}
