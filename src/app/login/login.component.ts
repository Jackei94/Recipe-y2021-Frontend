import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {Select, Store} from "@ngxs/store";
import {LoginState} from "./shared/state/login.state";
import {Observable} from "rxjs";
import {Location} from '@angular/common';
import {
  Login,
  Logout,
  Register,
  UpdateError,
  UpdateLoading,
  UpdateRegisterError
} from "./shared/state/login.actions";
import {LoginDto} from "./shared/dtos/login.dto";
import {AuthenticationService} from "../shared/services/authentication.service";
import {faChevronCircleLeft} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy {

  @Select(LoginState.loading)
  loading$: Observable<boolean> | undefined;

  @Select(LoginState.loginLoading)
  loginLoading$: Observable<boolean> | undefined;

  @Select(LoginState.registerLoading)
  registerLoading$: Observable<boolean> | undefined;

  @Select(LoginState.error)
  error$: Observable<string> |undefined

  @Select(LoginState.registerError)
  registerError$: Observable<string> |undefined

  saveLogin: boolean = false;
  circleLeft = faChevronCircleLeft;

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(24)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(8)])
  }, {validators: [this.passwordConfirming]});

  constructor( private store: Store, private location: Location, private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.store.dispatch(new Logout());
    const loginInfo: LoginDto = this.authService.getLoginInformation();

    if (loginInfo !== null) {
      this.loginForm.patchValue({username: loginInfo.username, password: loginInfo.password});
      this.saveLogin = true;
    }

    this.store.dispatch(new UpdateLoading(false));
  }

  login(): void{
    const loginData = this.loginForm.value;
    const loginDTO: LoginDto = {username: loginData.username, password: loginData.password}
    this.store.dispatch(new Login(loginDTO, this.saveLogin));
  }

  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('password').value !== c.get('passwordConfirm').value) {
      return {invalid: true};
    }
  }

  register(): void{
    const registerData = this.registerForm.value;
    const registerDTO: LoginDto = {username: registerData.username, password: registerData.password}
    this.store.dispatch(new Register(registerDTO, this.saveLogin));
  }

  goBack(): void{
    this.location.back();
  }

  ngOnDestroy(): void {
    this.store.dispatch(new UpdateError(''));
    this.store.dispatch(new UpdateRegisterError(''));
  }

}
