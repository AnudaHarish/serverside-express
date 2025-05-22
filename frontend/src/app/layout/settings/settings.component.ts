import { Component, OnInit } from '@angular/core';
import {UtilityService} from "../../service/utility.service";
import {NbGlobalPhysicalPosition, NbToastrService} from "@nebular/theme";
import {SessionStorageService} from "../../service/session-storage.service";
import {UserService} from "../../service/user.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {preserveWhitespacesDefault} from "@angular/compiler";
import {AuthInterceptor} from "../../interceptors/auth.interceptor";
import {Router} from "@angular/router";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  position = NbGlobalPhysicalPosition;
  user_id: string = '';
  userDetail: any = null;
  formGroup!: FormGroup;

  constructor(
    private utilityService: UtilityService,
    private toastrService: NbToastrService,
    private sessionStorage: SessionStorageService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initialisingForm();
    const needCheck = this.utilityService.isAvailable();
    if (needCheck) {
      this.utilityService.checkAuth();
    }
    this.user_id = this.sessionStorage.getItem("travelT_id");
    this.getUserInfo();
  }

  showToast(status: any, message: string, ref: string) {
    const position = this.position.TOP_RIGHT;
    this.toastrService.show(ref, message, { position,status });
  }

  getUserInfo(){
    if(this.user_id){
      this.userService.getUserDetails(this.user_id).subscribe({
        error: err => {
          console.log(err);
          if(err.error === 'Access token expired'){
            this.utilityService.openPopup();
          }
        },
        next: (res:any) => {
          console.log(res);
          this.userDetail = res.payload;
          this.patchValue();
        }
      });
    }
  }

  initialisingForm(){
    this.formGroup = new FormGroup({
      username: new FormControl(''),
      email: new FormControl('',[Validators.required, Validators.email]),
      pre_password: new FormControl(''),
      new_password: new FormControl(''),
      con_password: new FormControl(''),
    });
  }

  patchValue(){
    this.formGroup.patchValue({
      username: this.userDetail?.username,
      email: this.userDetail?.email,
    });
  }

  saveData(){
    const formValue = this.formGroup.value;
    const username = formValue.username;
    const email = formValue.email;
    const pre_password = formValue.pre_password;
    const con_password = formValue.con_password;
    const new_password = formValue.new_password;

    if(username === '' || email === ''){
      this.showToast("danger", "Username and email required", "Error");
      return;
    }else if(pre_password !== '' || con_password !== '' || new_password !== ''){
      if(pre_password === '' || new_password === '' || con_password === ''){
        this.showToast("danger", "All the fields in change password are required", "Error");
        return;
      }else if(new_password !== con_password){
        this.showToast("danger", "New password or Confirm password mismatch", "Error");
        return;
      }
    }else if(!this.formGroup.valid){
      this.showToast("danger", "Email is not valid", "Error");
      return;
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(formValue.email)) {
      this.showToast("danger", "Invalid email format", "Error");
      return;
    }
    console.log(this.formGroup)
    const updateObj = {
      username: username,
      email: email,
      pre_password: pre_password,
      con_password: con_password,
      new_password: new_password,
    }
    this.userService.updateUser(updateObj).subscribe({
      error: err => {
        console.log(err);
        if(err.error === 'Access token expired'){
          this.utilityService.openPopup();
        }else{
          this.showToast("danger", err.error, "Error");
        }
      },
      next: (res:any) => {
        this.showToast("success", "user updated", "Success");
        this.sessionStorage.clear();
        AuthInterceptor.accessToken = '';
        this.router.navigateByUrl('/login');
      }
    });
  }

}
