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
  NbSidebarModule
} from "@nebular/theme";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DashboardComponent} from "./dashboard/dashboard.component";



@NgModule({
  declarations: [
    LayoutComponent,
    DashboardComponent,
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
  ],
  exports: [LayoutComponent, DashboardComponent],
})
export class MainModule { }
