import { Component, OnInit } from '@angular/core';
import {UserFollowerService} from "../../service/user-follower.service";
import {UtilityService} from "../../service/utility.service";
import {SessionStorageService} from "../../service/session-storage.service";
import {NbGlobalPhysicalPosition, NbToastrService} from "@nebular/theme";
import {FormControl, Validators} from "@angular/forms";
import {map, Observable, of, startWith} from "rxjs";
import {BlogPostService} from "../../service/blog-post.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-follower',
  templateUrl: './user-follower.component.html',
  styleUrls: ['./user-follower.component.scss']
})
export class UserFollowerComponent implements OnInit {
  userList!:any[];
  user_id = '';
  position = NbGlobalPhysicalPosition;
  usernameControl!: FormControl;
  filteredControlOptions$!: Observable<string[]>;
  blogList!:any[];


  constructor(
    private userFollowerService: UserFollowerService,
    private utilityService: UtilityService,
    private sessionStorageService: SessionStorageService,
    private toastrService: NbToastrService,
    private blogPostService: BlogPostService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.usernameControl = new FormControl("");
    const needCheck = this.utilityService.isAvailable();
    if (needCheck) {
      this.utilityService.checkAuth();
    }
    this.user_id= this.sessionStorageService.getItem("travelT_id");
    this.getUserList();
    this.filteredControlOptions$ = this.usernameControl.valueChanges
      .pipe(
        startWith(''),
        map(filterString => this.filter(filterString)),
      );
  }

  private filter(value: string) {
    const filterValue = value.toLowerCase();
    return this.userList.filter(option => option.toLowerCase().includes(filterValue));
  }

  getUserList(){
    this.userFollowerService.getUserList().subscribe({
      error: err => {
        console.log(err);
        if(err.error === 'Access token expired'){
          this.utilityService.openPopup();
        }
      },
      next: (res:any) => {
        console.log(res);
        this.userList = res.payload.filter((user:any) => user.id !== this.user_id);
        this.filteredControlOptions$ = of(this.userList);
        this.getBlogPosts();
        console.log(this.userList);
      }
    });
  }

  followUser(id:number){
    this.userFollowerService.create(id).subscribe({
      error: error => {
        console.log(error);
        if(error.error === 'Access token expired'){
          this.utilityService.openPopup();
        }
      },
      next: res => {
        this.showToast("success", "Successfully followed", "Success");
        this.getUserList();
      }
    })
  }

  showToast(status: any, message: string, ref: string) {
    const position = this.position.TOP_RIGHT;
    this.toastrService.show(ref, message, { position,status });
  }

  getBlogPosts(){
    this.blogPostService.getBlogPostByFollowings().subscribe({
      error: err => {
        console.log(err);
        if(err.error === 'Access token expired'){
          this.utilityService.openPopup();
        }
      },
      next: res => {
        console.log(res);
        this.blogList = res.payload;
      }
    })
  }

  navigateView(id:any){
      this.router.navigate([`/view`, id]);
  }
}
