import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./layout/login/login.component";
import {LayoutComponent} from "./layout/main/layout/layout.component";
import {DashboardComponent} from "./layout/dashboard/dashboard.component";
import {AuthLayoutComponent} from "./layout/auth/auth-layout/auth-layout.component";
import {AuthGuard} from "./authGuard/auth.guard";
import {LoggedGuard} from "./authGuard/logged.guard";
import {RegistryComponent} from "./layout/registry/registry.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegistryComponent
  },

  // {
  //   path: '',
  //   component: AuthLayoutComponent,
  //   children: [
  //     {
  //       path: 'login',
  //       component: LoginComponent,
  //       canActivate: [LoggedGuard]
  //     },
  //     {
  //       path: 'registry',
  //       component: RegistryComponent,
  //       canActivate: [LoggedGuard]
  //     }
  //   ]
  // },
  // {
  //   path: '',
  //   component: LayoutComponent,
  //   canActivate: [AuthGuard],
  //   children: [
  //     {
  //       path: 'dashboard',
  //       component: DashboardComponent,
  //     }
  //   ],
  // },
  {
    path: '**',
    redirectTo: 'dashboard',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
