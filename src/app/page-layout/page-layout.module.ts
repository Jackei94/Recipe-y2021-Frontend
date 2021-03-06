import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NavBarComponent} from "./nav-bar/nav-bar.component";
import {HeaderComponent} from "./header/header.component";
import {FooterComponent} from "./footer/footer.component";
import {PageLayoutRoutingModule} from "./page-layout-routing.module";
import {NgxsModule} from "@ngxs/store";
import {LoginState} from "../login/shared/state/login.state";
import {SharedModule} from "../shared/shared.module";
import {PopoverModule} from 'ngx-bootstrap/popover';
import {ClickOutsideModule} from 'ng-click-outside';

@NgModule({
  declarations: [
    NavBarComponent,
    HeaderComponent,
    FooterComponent,
  ],
  exports: [
    HeaderComponent,
    NavBarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    PageLayoutRoutingModule,
    NgxsModule.forFeature([LoginState]),
    SharedModule,
    PopoverModule.forRoot(),
    ClickOutsideModule,
  ]
})
export class PageLayoutModule { }
