import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./layout/login/login.component";
import {DashboardComponent} from "./layout/dashboard/dashboard.component";
import {RegistryComponent} from "./layout/registry/registry.component";
import {CreateBlogComponent} from "./layout/create-blog/create-blog.component";
import {ViewBlogPostComponent} from "./layout/view-blog-post/view-blog-post.component";

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
    component: CreateBlogComponent
  },
  {
    path: 'view/:id',
    component: ViewBlogPostComponent
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
