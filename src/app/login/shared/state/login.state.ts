import {User} from "../../../shared/models/user";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable, NgZone} from "@angular/core";
import {
  LoadUserFromStorage,
  Login,
  Logout, Register,
  UpdateError,
  UpdateLoading,
  UpdateLoginLoading, UpdateRegisterError, UpdateRegisterLoading, UpdateUser
} from "./login.actions";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../../shared/services/authentication.service";
import {UserService} from "../../../shared/services/user.service";

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

  constructor(private authService: AuthenticationService, private userService: UserService,
              private router: Router, private ngZone: NgZone) {}

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


  @Action(LoadUserFromStorage)
  loadUserFromStorage(ctx: StateContext<LoginStateModel>) {
    const user: User = this.authService.getUserFromToken();
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

    this.authService.login(login.loginDTO).subscribe((success) => {
      ctx.dispatch(new LoadUserFromStorage());
      if(login.saveLogin){this.authService.saveLogin(login.loginDTO);}
      else{this.authService.forgetLogin();}


      this.ngZone.run(() => {this.router.navigate(['/home']);});


      ctx.dispatch(new UpdateError(''));},
      (error) => {ctx.dispatch(new UpdateError(error.error.message)); ctx.dispatch(new UpdateLoginLoading(false));},
      () => {ctx.dispatch(new UpdateLoginLoading(false));});
  }

  @Action(Logout)
  logout(ctx: StateContext<LoginStateModel>): void {
    this.authService.logout();
    const state = ctx.getState();
    const newState: LoginStateModel = {...state, user: null};
    ctx.setState(newState);
  }

  @Action(Register)
  register(ctx: StateContext<LoginStateModel>, register: Register): void {

    ctx.dispatch(new UpdateRegisterLoading(true));

    this.userService.register(register.loginDTO).subscribe((user) => {
      ctx.dispatch(new Login(register.loginDTO, register.saveLogin));
      ctx.dispatch(new UpdateRegisterError(''));},
      (error) => {ctx.dispatch(new UpdateRegisterError(error.error.message)); ctx.dispatch(new UpdateRegisterLoading(false));},
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
