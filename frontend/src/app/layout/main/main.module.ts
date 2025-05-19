import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LayoutComponent} from "./layout/layout.component";
import {RouterModule} from "@angular/router";
import {
  NbAutocompleteModule,
  NbButtonModule,
  NbCardModule,
  NbIconModule, NbInputModule,
  NbLayoutModule,
  NbMenuModule,
  NbSidebarModule, NbThemeModule
} from "@nebular/theme";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DashboardComponent} from "../dashboard/dashboard.component";
import {LoginComponent} from "../login/login.component";
import {RegistryComponent} from "../registry/registry.component";

@NgModule({
  declarations: [
    LayoutComponent,
    DashboardComponent,
    LoginComponent,
    RegistryComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NbLayoutModule,
    NbSidebarModule,
    NbMenuModule,
    NbButtonModule,
    NbCardModule,
    FormsModule,
    NbIconModule,
    NbAutocompleteModule,
    NbInputModule,
    ReactiveFormsModule,
    NbThemeModule
  ],
  exports: [LayoutComponent, DashboardComponent, LoginComponent, RegistryComponent],
})
export class MainModule { }
