import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ProgressbarModule} from "ngx-bootstrap/progressbar";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,FontAwesomeModule, ReactiveFormsModule, ProgressbarModule, FormsModule,
  ],
  exports: [CommonModule,FontAwesomeModule, ReactiveFormsModule, ProgressbarModule, FormsModule],
  providers: []
})

export class SharedModule { }
