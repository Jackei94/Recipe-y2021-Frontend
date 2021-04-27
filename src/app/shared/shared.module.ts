import {Injectable, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ProgressbarModule} from "ngx-bootstrap/progressbar";
import {HttpClientModule} from "@angular/common/http";
import {Socket} from "ngx-socket-io";
import {ModalModule} from "ngx-bootstrap/modal";
import {AlertModule} from "ngx-bootstrap/alert";

@Injectable({providedIn: 'root'})
export class SocketRecipeApp extends Socket {
  constructor() {
    super({ url: 'http://localhost:3100', options: {} });
  }
}


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    ProgressbarModule,
    FormsModule,
    ModalModule.forRoot()
  ],
  exports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    ProgressbarModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [SocketRecipeApp]
})

export class SharedModule { }
