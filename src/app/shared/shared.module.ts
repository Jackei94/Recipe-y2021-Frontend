import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ProgressbarModule} from "ngx-bootstrap/progressbar";
import {NgxsModule} from "@ngxs/store";
import {LoginState} from "../login/shared/state/login.state";
import {environment} from "../../environments/environment";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,FontAwesomeModule, ReactiveFormsModule, ProgressbarModule, FormsModule, NgxsModule.forRoot([LoginState], {developmentMode: !environment.production})
  ],
  exports: [CommonModule,FontAwesomeModule, ReactiveFormsModule, ProgressbarModule, FormsModule],
  providers: []
})

export class SharedModule { }
