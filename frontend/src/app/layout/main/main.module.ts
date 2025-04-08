import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LayoutComponent} from "./layout/layout.component";
import {RouterModule} from "@angular/router";
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbLayoutModule,
  NbMenuModule,
  NbSidebarModule
} from "@nebular/theme";
import {FormsModule} from "@angular/forms";
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
    NbIconModule
  ],
  exports: [LayoutComponent, DashboardComponent],
})
export class MainModule { }
