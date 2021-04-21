import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FrontpageComponent } from './frontpage/frontpage.component';
import {PageLayoutModule} from "./page-layout/page-layout.module";
import { LoginComponent } from './login/login.component';

const config: SocketIoConfig = {url: 'http://localhost:3100', options: {}}

@NgModule({
  declarations: [
    AppComponent,
    FrontpageComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    FontAwesomeModule,
    PageLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
