import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../service/auth.service";
import {AuthRequest,AuthResponse} from "../../shared/models/auth.request";
import {AuthInterceptor} from "../../interceptors/auth.interceptor";
import {NbGlobalPhysicalPosition, NbToastrService} from "@nebular/theme";
import {SessionStorageService} from "../../service/session-storage.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginObj: AuthRequest = {
    "email": '',
    "psw": ''
  }
  position = NbGlobalPhysicalPosition;
  constructor(
    private router: Router,
    private authService: AuthService,
    private toastrService: NbToastrService,
    private sessionStorage: SessionStorageService,
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {

  }

  onSubmit() {
      this.authService.login(this.loginObj).subscribe({
        error: (err) => {
          console.log("Error", err);
          this.showToast("danger", "Email and Password required", "Error");
        },
        next: (res) => {
          const token = res?.accessToken;
          const payload = JSON.parse(atob(token.split(".")[1]));
          console.log(payload?.user?.id);
          if(!payload || !payload?.user){
            return console.error("Error in authentication");
          }
          AuthInterceptor.accessToken = token;
          this.sessionStorage.setKey("travelT_id", payload.user?.id);
          this.sessionStorage.setKey("travelT_username", payload.user?.username);
          this.router.navigateByUrl('/dashboard');
        }
      })
  }

  showToast(status: any, message: string, ref: string) {
    const position = this.position.TOP_RIGHT
    this.toastrService.show(ref, message, { position,status });
  }
}
