import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthLayoutComponent} from "./auth-layout/auth-layout.component";
import {RouterModule} from "@angular/router";
import {
  NbButtonModule,
  NbCardModule,
  NbInputModule,
  NbLayoutModule,
  NbThemeModule,
  NbToastrModule
} from "@nebular/theme";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LoginComponent} from "./login/login.component";
import { RegistryComponent } from './registry/registry.component';



@NgModule({
  declarations: [AuthLayoutComponent, LoginComponent, RegistryComponent],
  imports: [
    CommonModule,
    RouterModule,
    NbLayoutModule,
    NbInputModule,
    NbButtonModule,
    NbCardModule,
    FormsModule,
    ReactiveFormsModule,
    NbToastrModule
  ],
  exports: [AuthLayoutComponent, LoginComponent],
})
export class AuthModule { }
