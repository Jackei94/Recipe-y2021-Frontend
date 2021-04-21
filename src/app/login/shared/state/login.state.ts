import {User} from "../../../shared/models/user";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {
  LoadUserFromStorage,
  Login,
  Logout, Register,
  SaveUserInStorage, UpdateError,
  UpdateLoading,
  UpdateLoginLoading, UpdateRegisterError, UpdateRegisterLoading, UpdateUser
} from "./login.actions";
import {UserService} from "../../../shared/services/user.service";
import {Router} from "@angular/router";

export interface LoginStateModel{
  user: User;
  error: string;
  registerError: string;
  loading: boolean;
  loginLoading: boolean;
  registerLoading: boolean;
}

@State<LoginStateModel>({
  name: 'login',
  defaults: {
    user: null,
    error: '',
    registerError: '',
    loading: true,
    loginLoading: false,
    registerLoading: false,
  }
})

@Injectable()
export class LoginState {

  constructor(private userService: UserService, private router: Router) {}

  @Selector()
  static user(state: LoginStateModel): User{
    return state.user;
  }
  @Selector()
  static loading(state: LoginStateModel): boolean{
    return state.loading;
  }

  @Selector()
  static loginLoading(state: LoginStateModel): boolean{
    return state.loginLoading;
  }

  @Selector()
  static registerLoading(state: LoginStateModel): boolean{
    return state.registerLoading;
  }

  @Selector()
  static error(state: LoginStateModel): string{
    return state.error;
  }

  @Selector()
  static registerError(state: LoginStateModel): string{
    return state.registerError;
  }


  @Action(SaveUserInStorage)
  saveUserInStorage(ctx: StateContext<LoginStateModel>, suis: SaveUserInStorage): void {
    this.userService.saveUser(suis.user);
  }

  @Action(LoadUserFromStorage)
  loadUserFromStorage(ctx: StateContext<LoginStateModel>): void {
    const user: User = this.userService.getUser();
    ctx.dispatch(new UpdateUser(user));
  }

  @Action(UpdateUser)
  updateUser(ctx: StateContext<LoginStateModel>, uu: UpdateUser): void{
    const state = ctx.getState();
    const newState: LoginStateModel = {...state, user: uu.user};
    ctx.setState(newState);
  }

  @Action(Login)
  login(ctx: StateContext<LoginStateModel>, login: Login){

    ctx.dispatch(new UpdateLoginLoading(true));

    this.userService.login(login.loginDTO).subscribe((user) => {
      ctx.dispatch(new UpdateUser(user));
      ctx.dispatch(new SaveUserInStorage(user));
      if(login.saveLogin){this.userService.saveLogin(login.loginDTO);}
      else{this.userService.forgetLogin();}
      this.router.navigate(['']);
      ctx.dispatch(new UpdateError(''));},
      (error) => {ctx.dispatch(new UpdateError(error.error.message)); ctx.dispatch(new UpdateLoginLoading(false));},
      () => {ctx.dispatch(new UpdateLoginLoading(false));});

  }

  @Action(Logout)
  logout(ctx: StateContext<LoginStateModel>): void {
    this.userService.removeUser();
    const state = ctx.getState();
    const newState: LoginStateModel = {...state, user: null};
    ctx.setState(newState);
  }

  @Action(Register)
  register(ctx: StateContext<LoginStateModel>, register: Register): void {

    ctx.dispatch(new UpdateRegisterLoading(true));
    this.userService.register(register.loginDTO).subscribe((user) => {
      ctx.dispatch(new UpdateUser(user));
      ctx.dispatch(new SaveUserInStorage(user));
      if(register.saveLogin){this.userService.saveLogin(register.loginDTO);}
      else{this.userService.forgetLogin();}
      this.router.navigate(['']);
      ctx.dispatch(new UpdateRegisterError(''));},
      (error) => {console.log(error); ctx.dispatch(new UpdateRegisterError(error.error.message)); ctx.dispatch(new UpdateRegisterLoading(false));},
      () => {ctx.dispatch(new UpdateRegisterLoading(false));}
      );

  }

  @Action(UpdateLoading)
  updateLoading(ctx: StateContext<LoginStateModel>, ul: UpdateLoading): void{
    const state = ctx.getState();
    const newState: LoginStateModel = {...state, loading: ul.loading};
    ctx.setState(newState);
  }

  @Action(UpdateLoginLoading)
  updateLoginLoading(ctx: StateContext<LoginStateModel>, ull: UpdateLoginLoading): void{
    const state = ctx.getState();
    const newState: LoginStateModel = {...state, loginLoading: ull.loading};
    ctx.setState(newState);
  }

  @Action(UpdateRegisterLoading)
  updateRegisterLoading(ctx: StateContext<LoginStateModel>, url: UpdateRegisterLoading): void{
    const state = ctx.getState();
    const newState: LoginStateModel = {...state, registerLoading: url.loading};
    ctx.setState(newState);
  }

  @Action(UpdateError)
  updateError(ctx: StateContext<LoginStateModel>, ur: UpdateError){
    const state = ctx.getState();
    const newState: LoginStateModel = {...state, error: ur.error};
    ctx.setState(newState);
  }

  @Action(UpdateRegisterError)
  updateRegisterError(ctx: StateContext<LoginStateModel>, ure: UpdateRegisterError){
    const state = ctx.getState();
    const newState: LoginStateModel = {...state, registerError: ure.error};
    ctx.setState(newState);
  }


}
