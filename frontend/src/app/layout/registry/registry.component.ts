import { Component, OnInit } from '@angular/core';
import {AuthRequest, Registry} from "../../shared/models/auth.request";
import {NbGlobalPhysicalPosition, NbToastrService} from "@nebular/theme";
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-registry',
  templateUrl: './registry.component.html',
  styleUrls: ['./registry.component.scss']
})
export class RegistryComponent implements OnInit {
  registerObj: Registry = {
    email : '',
    username : '',
    new_password: '',
    con_password: ''
  }
  position = NbGlobalPhysicalPosition

  constructor(
    private toastrService:NbToastrService,
    private authService: AuthService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
  }

  onSubmit(){
    if(this.registerObj.email === '' || this.registerObj.username === '' || this.registerObj.new_password === '' || this.registerObj.con_password === '' || this.registerObj.con_password === ''){
      this.showToast("danger","All fields are required", "Error");
      return;
    }else if(this.registerObj.con_password !== this.registerObj.new_password){
      this.showToast("danger","Password does not match", "Error");
      return;
    }
    // Email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.registerObj.email)) {
      this.showToast("danger", "Invalid email format", "Error");
      return;
    }
    this.authService.register(this.registerObj).subscribe({
      error: (err:HttpErrorResponse) => {
        console.log("Error", err.error);
        console.log(Object.keys(err).length)
        this.showToast("danger", err?.error ? err?.error?.message : "User register unsuccessful", "Error");
      },
      next: (res) => {
        console.log(res.headers);
        if(res.status === 201) {
          this.showToast("success", "Successful user register", "Success");
          this.router.navigateByUrl('/login');
        }else{
          this.showToast("danger", "User register unsuccessful", "Error");
        }
      }
    })
  }

  showToast(status: any, message: string, ref: string) {
    const position = this.position.TOP_RIGHT
    this.toastrService.show(ref, message, { position,status });
  }
}
