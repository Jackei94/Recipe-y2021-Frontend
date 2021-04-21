import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(24)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(8)])
  }, {validators: [this.passwordConfirming]});

  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('password').value !== c.get('passwordConfirm').value) {
      return {invalid: true};
    }
  }

  loading: boolean = true;
  loginLoad: boolean = false;
  registerLoad: boolean = false;

  saveLogin: boolean = false;
  error: string = '';
  registerError: string = '';

  constructor(private router: Router, private authService: AuthenticationService,
              private userService: UserService, private location: Location) { }

  ngOnInit(): void {

    this.authService.logout();

    const loginInfo = this.authService.getLoginInformation();
    if (loginInfo !== null) {
      this.loginForm.patchValue({
        username: loginInfo.username,
        password: loginInfo.password
      });
      this.saveLogin = true;
    }
    this.loading = false;
  }

  login(): void{

    this.loginLoad = true;

    const loginData = this.loginForm.value;
    const username: string = loginData.username;
    const password: string = loginData.password;

    this.authService.login(username, password).subscribe(success => {
        if(this.saveLogin){
          this.authService.saveLogin(username, password);
        }
        else{
          this.authService.forgetLogin();
        }},
      error => {this.error = error.error; this.loginLoad = false;},
      () => {this.loginLoad = false; this.router.navigate(['']);});
  }

  register(): void{

    this.registerLoad = true;

    const registerData = this.registerForm.value;
    const username: string = registerData.username;
    const password: string = registerData.password;

    this.userService.register(username, password).subscribe(success => {

        this.authService.login(username, password).subscribe(success => {
            if(this.saveLogin){
              this.authService.saveLogin(username, password);
            }
            else{
              this.authService.forgetLogin();
            }},
          error => {this.registerError = error.error; this.loginLoad = false;},
          () => {this.loginLoad = false; this.router.navigate([''])});
      },
      error => {this.registerError = error.error; this.registerLoad = false;},
      () => {this.registerLoad = false;});
  }

  goBack(): void{
    this.location.back();
  }

}
