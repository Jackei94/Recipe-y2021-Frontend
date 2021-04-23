import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FrontpageComponent } from './frontpage/frontpage.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {PageLayoutModule} from "./page-layout/page-layout.module";
import { LoginComponent } from './login/login.component';
import {SharedModule} from "./shared/shared.module";
import {NgxsModule} from "@ngxs/store";
import {environment} from "../environments/environment";
import {AuthInterceptor} from "./auth-guards/auth.interceptor";

const config: SocketIoConfig = {url: 'http://localhost:3100', options: {}}

@NgModule({
  declarations: [
    AppComponent,
    FrontpageComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    NgxsModule.forRoot([], {developmentMode: !environment.production}),
    FontAwesomeModule,
    PageLayoutModule,

    SharedModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
