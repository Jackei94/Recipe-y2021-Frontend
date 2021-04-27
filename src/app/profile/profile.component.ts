import {Component, OnInit, TemplateRef} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../shared/models/user";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {UserService} from "../shared/services/user.service";
import {Router} from "@angular/router";
import {AuthenticationService} from "../shared/services/authentication.service";
import {UpdateUser} from "../login/shared/state/login.actions";
import {UserUpdateDto} from "./shared/dtos/user.update.dto";
import {Location} from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  updateForm = new FormGroup({
    oldPassword: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(8)])
  }, {validators: [this.passwordConfirming]});

  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('password').value !== c.get('passwordConfirm').value) {
      return {invalid: true};}}

  loading: boolean = false;
  formLoading: boolean = false;
  error: string = '';

  user: User = null;
  modalRef: BsModalRef;
  passwordUpdateLoading: boolean = false;
  passwordError: string = '';

  constructor(private userService: UserService, private authService: AuthenticationService,
              private router: Router, private location: Location) { }

  ngOnInit(): void {
  }

  updatePassword(): void{

    this.passwordUpdateLoading = true;
    const passwordData = this.updateForm.value;
    const userID = this.authService.getID();

    const updateUserDTO: UserUpdateDto = {userID: userID, password: passwordData.password, oldPassword: passwordData.oldPassword}

    this.userService.updateUserPassword(updateUserDTO).subscribe(() => {this.passwordUpdateLoading = false;},
      (error) => {this.error = error.error.message; this.passwordUpdateLoading = false;});
  }

  goBack(): void{
    this.location.back();
  }

}
