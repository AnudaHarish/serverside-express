import {Component, Inject, Input, OnInit} from '@angular/core';
import {NB_DIALOG_CONFIG, NbDialogRef} from "@nebular/theme";
import {AuthService} from "../../../service/auth.service";
import {SessionStorageService} from "../../../service/session-storage.service";
import {Router} from "@angular/router";
import {AuthInterceptor} from "../../../interceptors/auth.interceptor";


@Component({
  selector: 'app-session-expired',
  templateUrl: './session-expired.component.html',
  styleUrls: ['./session-expired.component.scss']
})
export class SessionExpiredComponent implements OnInit {
  @Input()title: string = '';
  constructor(
    protected dialogRef: NbDialogRef<SessionExpiredComponent>,
    @Inject(NB_DIALOG_CONFIG) public config:any,
    private authService: AuthService,
    private sessionStorage: SessionStorageService,
    private router: Router,
  ) {}

  ngOnInit(): void {

  }

  close(){
    this.dialogRef.close();
  }

  refreshAccessToken(){
    this.authService.refreshToken().subscribe({
      error: err =>{
        console.error(err)
        sessionStorage.clear();
        AuthInterceptor.accessToken = '';
        this.router.navigateByUrl('/dashboard');
        this.close();
      },
      next: (res) => {
        console.log(res)
        if(res) {
            let accessToken = res.accessToken;
            AuthInterceptor.accessToken = accessToken;
            let payload:any = JSON.parse(atob(accessToken.split(".")[1]));
            console.log(payload);
            //set session storage
            this.sessionStorage.setKey("travelT_id", payload?.user?.id);
            this.sessionStorage.setKey("travelT_username", payload?.user?.username);
            this.close();
        }
      }
    });
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
          this.router.navigateByUrl('/dashboard');
          this.close();
        }
      }
    })
  }
}
