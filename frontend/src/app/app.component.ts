import {Component, OnInit} from '@angular/core';
import {NbMenuItem, NbMenuService, NbSidebarService} from "@nebular/theme";
import {Router} from "@angular/router";
import {AuthService} from "./service/auth.service";
import {AuthInterceptor} from "./interceptors/auth.interceptor";
import {BehaviorSubject, filter, map, startWith} from "rxjs";
import {SessionStorageService} from "./service/session-storage.service";
import {CountriesService} from "./service/countries.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  menuItems: NbMenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'home-outline',
      link: '/dashboard',
    },
    {
      title: 'Create Blog',
      icon: 'book-outline',
      link: '/create',
    },
    {
      title: 'Community',
      icon: 'people-outline',
      link: '/follower',
    },
    {
      title: 'Settings',
      icon: 'settings-2-outline',
      link: '/setting',
    }
  ];
  items = [
    {title: "Login"},
    {title: "Register"},
  ];
  items2 = [
    {title: "Profile"},
    {title: "Logout"},
  ];
  isLoggIn: boolean = false;
  username: string = '';
  isCollapsed: boolean = false;

  constructor(
    private sidebarService: NbSidebarService,
    private router: Router,
    private authService: AuthService,
    private nbMenuService: NbMenuService,
    private sessionStorage: SessionStorageService,
    private countryService: CountriesService,
  ) { }

  ngOnInit(): void {
    this.sessionStorage.sessionUpdate$.subscribe((value) => {
      this.checkUserInfo();
    });
    this.getCountryName();
    this.nbMenuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'my-context-menu'),
        map(({ item: { title } }) => title),
      )
      .subscribe(title => {
        switch (title) {
          case("Login"):
            this.router.navigateByUrl("login");
            break;
          case("Register"):
            this.router.navigateByUrl("register");
            break;
          case("Profile"):
            this.router.navigateByUrl("profile");
            break;
          case("Logout"):
            this.logout();
            break;
        }
      });
  }

  toggleSidebar() {
    // this.isCollapsed = !this.isCollapsed;
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
          this.sessionStorage.clear();
          AuthInterceptor.accessToken = '';
          // this.router.navigateByUrl('/login');
        }
      }
    })
  }

  login(){
    this.router.navigateByUrl('/login');
  }

  checkUserInfo(){
    this.isLoggIn = this.sessionStorage.checkUser();
    this.username = this.sessionStorage.getItem("travelT_username")||'Login/Register';
  }

  getCountryName(){
    this.countryService.getCountryNames().subscribe({
      error: err => {
        console.log(err)},
      next: (res) => {
        console.log(res);
        this.sessionStorage.setKey("nameList", res);
        // this.options = res;
        // this.filteredControlOptions$ = this.countryName.valueChanges
        //   .pipe(
        //     startWith(''),
        //     map(filterString => this.filter(filterString)),
        //   );
      },
    })
  }

}
