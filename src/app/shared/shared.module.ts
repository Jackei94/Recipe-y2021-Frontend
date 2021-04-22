import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ProgressbarModule} from "ngx-bootstrap/progressbar";
import {HttpClientModule} from "@angular/common/http";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,FontAwesomeModule, ReactiveFormsModule, ProgressbarModule, FormsModule,
  ],
  exports: [CommonModule,FontAwesomeModule, ReactiveFormsModule, ProgressbarModule, FormsModule, HttpClientModule],
  providers: []
})

export class SharedModule { }
