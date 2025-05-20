import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {
  NbAutocompleteModule,
  NbButtonModule, NbCardModule, NbContextMenuModule, NbDatepickerModule, NbDialogModule, NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbMenuModule, NbSelectModule,
  NbSidebarModule,
  NbThemeModule, NbToastrModule, NbUserModule,
} from "@nebular/theme";
import {NbEvaIconsModule} from "@nebular/eva-icons";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptor} from "./interceptors/auth.interceptor";
import { SessionExpiredComponent } from './layout/popup/session-expired/session-expired.component';
import { SmartTableComponent } from './tables/smart-table/smart-table.component';
import {RegistryComponent} from "./layout/registry/registry.component";
import {LoginComponent} from "./layout/login/login.component";
import {DashboardComponent} from "./layout/dashboard/dashboard.component";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import { CreateBlogComponent } from './layout/create-blog/create-blog.component';

@NgModule({
  declarations: [
    AppComponent,
    SessionExpiredComponent,
    SmartTableComponent,
    RegistryComponent,
    LoginComponent,
    DashboardComponent,
    CreateBlogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NbButtonModule,
    NbEvaIconsModule,
    NbLayoutModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbInputModule,
    FormsModule,
    HttpClientModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbToastrModule.forRoot(),
    NbAutocompleteModule,
    NbCardModule,
    NbIconModule,
    NbUserModule,
    NbContextMenuModule,
    NbDialogModule.forRoot(),
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    NbDatepickerModule.forRoot(),
    NbSelectModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ],
  exports: [
    SmartTableComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
