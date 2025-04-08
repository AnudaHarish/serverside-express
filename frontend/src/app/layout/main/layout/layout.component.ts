import { Component, OnInit } from '@angular/core';
import {NbMenuItem, NbSidebarService} from "@nebular/theme";
import {Router} from "@angular/router";
import {AuthService} from "../../../service/auth.service";
import {AuthInterceptor} from "../../../interceptors/auth.interceptor";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  menuItems: NbMenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'home-outline',
      link: '/dashboard',
    },
  ];

  constructor(
    private sidebarService: NbSidebarService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  toggleSidebar() {
    this.sidebarService.toggle(true);
    return false;
  }

  logout() {
      this.authService.logout().subscribe({
        error: (err) => {
          console.log(err)
        },
        next: (res) => {
          if(res.status === 204) {
            AuthInterceptor.accessToken = '';
            this.router.navigateByUrl('/login');
          }
        }
      })
  }

}
