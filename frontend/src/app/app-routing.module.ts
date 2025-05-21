import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./layout/login/login.component";
import {DashboardComponent} from "./layout/dashboard/dashboard.component";
import {RegistryComponent} from "./layout/registry/registry.component";
import {CreateBlogComponent} from "./layout/create-blog/create-blog.component";
import {ViewBlogPostComponent} from "./layout/view-blog-post/view-blog-post.component";
import {UserFollowerComponent} from "./layout/user-follower/user-follower.component";
import {ProfileComponent} from "./layout/profile/profile.component";
import {SettingsComponent} from "./layout/settings/settings.component";
import {AuthGuard} from "./authGuard/auth.guard";

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
  {
    path: 'create',
    component: CreateBlogComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'follower',
    component: UserFollowerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'setting',
    component: SettingsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create/:id',
    component: CreateBlogComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view/:id',
    component: ViewBlogPostComponent
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
