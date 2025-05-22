import { Component, OnInit } from '@angular/core';
import {UtilityService} from "../../service/utility.service";
import {UserFollowerService} from "../../service/user-follower.service";
import {NbGlobalPhysicalPosition, NbToastrService} from "@nebular/theme";
import {UserService} from "../../service/user.service";
import {SessionStorageService} from "../../service/session-storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  position = NbGlobalPhysicalPosition;
  followerList: any[] = [];
  followingList: any[] = [];
  user_id: string = '';
  userDetail: any = null;

  constructor(
    private utilityService: UtilityService,
    private followerService: UserFollowerService,
    private toastrService: NbToastrService,
    private userService: UserService,
    private sessionStorage: SessionStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const needCheck = this.utilityService.isAvailable();
    if (needCheck) {
      this.utilityService.checkAuth();
    }
    this.user_id = this.sessionStorage.getItem("travelT_id");
    this.getUserInfo();
    this.getFollowerList();
    this.getFollowingList();
  }

  getFollowingList(){
    this.followerService.getFollowerList().subscribe({
      error: err => {
        console.log(err);
        if(err.error === 'Access token expired'){
          this.utilityService.openPopup();
        }
      },
      next: (res:any) => {
        console.log(res);
        this.followingList = res.payload;
        console.log(this.followingList);
      }
    })
  }

  getFollowerList(){
    this.followerService.getFollowingList().subscribe({
      error: err => {
        console.log(err);
        if(err.error === 'Access token expired'){
          this.utilityService.openPopup();
        }
      },
      next: (res:any) => {
        console.log(res);
        this.followerList = res?.payload;
      }
    })
  }

  unfollowUser(id:any){
    this.followerService.unfollow(id).subscribe({
      error: err => {
        console.log(err);
        if(err.error === 'Access token expired'){
          this.utilityService.openPopup();
        }
      },
      next: (res:any) => {
        this.showToast("success", "Successfully unfollowed", "Success");
        this.getFollowingList();
        this.getFollowerList();
      }
    })
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
        }
      });
    }
  }

  editUser(){
    this.router.navigateByUrl('/setting');
  }

  showToast(status: any, message: string, ref: string) {
    const position = this.position.TOP_RIGHT;
    this.toastrService.show(ref, message, { position,status });
  }
}
