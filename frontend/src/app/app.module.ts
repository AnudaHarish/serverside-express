import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {
  NbAutocompleteModule,
  NbButtonModule,
  NbInputModule,
  NbLayoutModule,
  NbMenuModule,
  NbSidebarModule,
  NbThemeModule, NbToastrModule
} from "@nebular/theme";
import {NbEvaIconsModule} from "@nebular/eva-icons";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptor} from "./interceptors/auth.interceptor";
import { MainModule } from './layout/main/main.module';
import {AuthModule} from "./layout/auth/auth.module";



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NbButtonModule,
    NbEvaIconsModule,
    NbLayoutModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({name: 'default'}),
    NbInputModule,
    FormsModule,
    HttpClientModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    AuthModule,
    MainModule,
    NbToastrModule.forRoot(),
    NbAutocompleteModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
