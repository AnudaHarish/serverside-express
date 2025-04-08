import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../../service/auth.service";
import {AuthRequest,AuthResponse} from "../../../shared/models/auth.request";
import {AuthInterceptor} from "../../../interceptors/auth.interceptor";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginObj: AuthRequest = {
    "name": '',
    "psw": ''
  }

  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {

  }

  onSubmit() {
      this.authService.login(this.loginObj).subscribe({
        error: (err) => {
          console.log("Error", err);
        },
        next: (res) => {
          console.log(res);
          AuthInterceptor.accessToken = res?.accessToken;
          this.router.navigateByUrl('/dashboard');
        }
      })

  }



}
