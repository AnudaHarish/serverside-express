import { Injectable } from '@angular/core';
import {AuthService} from "./auth.service";
import {SessionStorageService} from "./session-storage.service";
import {SessionExpiredComponent} from "../layout/popup/session-expired/session-expired.component";
import {NbDialogService} from "@nebular/theme";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(
    private authService: AuthService,
    private sessionService: SessionStorageService,
    private dialogService: NbDialogService,
    private router: Router
  ) {}

  //checkAuthentication
  checkAuth(){
    this.authService.checkAuth().subscribe({
      error: err => {
        console.log(err)
        if(err.status === 401 && err.error.message === "Refresh required"){
          console.log("working")
          this.openPopup();
        }else{
          this.sessionService.clear();
          this.router.navigateByUrl('/dashboard');
        }
      },
      next: (res) => {

      }
    });
  }

  //check the username and the id
  isAvailable(): boolean {
    const token = this.sessionService.getItem("travelT_token");
    const id = this.sessionService.getItem("travelT_id");
    const username = this.sessionService.getItem("travelT_username");
    return !!(token || id || username);
  }

  openPopup(){
    let dialogRef = this.dialogService.open(SessionExpiredComponent);
    dialogRef.componentRef.instance.title = 'test';
  }
}
