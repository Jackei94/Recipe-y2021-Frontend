import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../shared/models/user";
import {UserService} from "../shared/services/user.service";
import {Router} from "@angular/router";
import {AuthenticationService} from "../shared/services/authentication.service";
import {UserUpdateDto} from "./shared/dtos/user.update.dto";
import {Location} from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  loading: boolean = true;
  formLoading: boolean = false;
  error: string = '';

  passwordUpdateLoading: boolean = false;
  passwordUpdated: boolean = false;
  dismissTimeout = 5000;

  user: User = null;

  updateForm = new FormGroup({
    oldPassword: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(8)])
  }, {validators: [this.passwordConfirming]});

  constructor(private userService: UserService, private authService: AuthenticationService,
              private router: Router, private location: Location) { }

  ngOnInit(): void {
    this.loadUser();
  }

  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('password').value !== c.get('passwordConfirm').value) {
      return {invalid: true};}}

  loadUser(){
    const userID = this.authService.getID();
    this.userService.getUserById(userID).subscribe((user) => {this.user = user; this.loading = false;},
      (error) => {this.error = error.error.message; this.loading = false;})
  }

  updatePassword(): void{

    this.passwordUpdateLoading = true;
    const passwordData = this.updateForm.value;
    const userID = this.authService.getID();

    const updateUserDTO: UserUpdateDto = {userID: userID, password: passwordData.password, oldPassword: passwordData.oldPassword}

    this.userService.updateUserPassword(updateUserDTO).subscribe(() => {
      this.passwordUpdateLoading = false;
      this.passwordUpdated = true;
      this.updateForm.reset();},
      (error) => {this.error = error.error.message; this.passwordUpdateLoading = false;});
  }

  goBack(): void{
    this.location.back();
  }

}
