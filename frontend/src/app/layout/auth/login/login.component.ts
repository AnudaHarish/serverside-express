import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../../service/auth.service";
import {AuthRequest,AuthResponse} from "../../../shared/models/auth.request";
import {AuthInterceptor} from "../../../interceptors/auth.interceptor";
import {NbGlobalPhysicalPosition, NbToastrService} from "@nebular/theme";


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
  position = NbGlobalPhysicalPosition;
  constructor(
    private router: Router,
    private authService: AuthService,
    private toastrService: NbToastrService,
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {

  }

  onSubmit() {
      this.authService.login(this.loginObj).subscribe({
        error: (err) => {
          console.log("Error", err);
          this.showToast("danger", "Username and Password required", "Error");
        },
        next: (res) => {
          console.log(res);
          AuthInterceptor.accessToken = res?.accessToken;
          this.router.navigateByUrl('/dashboard');
        }
      })

  }

  showToast(status: any, message: string, ref: string) {
    const position = this.position.TOP_RIGHT
    this.toastrService.show(ref, message, { position,status });
  }
}
