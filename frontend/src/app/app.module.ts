import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {
  NbAutocompleteModule,
  NbButtonModule, NbCardModule, NbContextMenuModule, NbDialogModule, NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbMenuModule,
  NbSidebarModule,
  NbThemeModule, NbToastrModule, NbUserModule
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

@NgModule({
  declarations: [
    AppComponent,
    SessionExpiredComponent,
    SmartTableComponent,
    RegistryComponent,
    LoginComponent,
    DashboardComponent,
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
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  exports: [
    SmartTableComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
