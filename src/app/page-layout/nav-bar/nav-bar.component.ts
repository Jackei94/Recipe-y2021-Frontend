import { Component, OnInit } from '@angular/core';
import {Select, State, Store} from "@ngxs/store";
import {LoginState} from "../../login/shared/state/login.state";
import {Observable} from "rxjs";
import {User} from "../../shared/models/user";
import {LoadUserFromStorage} from "../../login/shared/state/login.actions";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  @Select(LoginState.user)
  loggedUser$: Observable<User> | undefined;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new LoadUserFromStorage());
  }

}
