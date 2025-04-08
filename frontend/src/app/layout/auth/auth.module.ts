import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthLayoutComponent} from "./auth-layout/auth-layout.component";
import {RouterModule} from "@angular/router";
import {NbButtonModule, NbCardModule, NbInputModule, NbLayoutModule, NbThemeModule} from "@nebular/theme";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LoginComponent} from "./login/login.component";



@NgModule({
  declarations: [AuthLayoutComponent, LoginComponent],
  imports: [
    CommonModule,
    RouterModule,
    NbLayoutModule,
    NbInputModule,
    NbButtonModule,
    NbCardModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [AuthLayoutComponent, LoginComponent],
})
export class AuthModule { }
