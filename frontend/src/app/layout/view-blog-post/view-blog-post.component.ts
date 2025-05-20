import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BlogPostService} from "../../service/blog-post.service";
import {NbGlobalPhysicalPosition, NbToastrService} from "@nebular/theme";
import {SessionStorageService} from "../../service/session-storage.service";
import {FormControl} from "@angular/forms";
import {UtilityService} from "../../service/utility.service";
import {CommentsService} from "../../service/comments.service";

@Component({
  selector: 'app-view-blog-post',
  templateUrl: './view-blog-post.component.html',
  styleUrls: ['./view-blog-post.component.scss']
})
export class ViewBlogPostComponent implements OnInit {
  blogId: any = '';
  position = NbGlobalPhysicalPosition;
  data: any = null;
  userId: string = '';
  username: string = '';
  isOpened: boolean = false;
  commentsControl!: FormControl;

  constructor(
    private route: ActivatedRoute,
    private blogPostService: BlogPostService,
    private toastrService: NbToastrService,
    private sessionStorage: SessionStorageService,
    private utilityService: UtilityService,
    private commentService: CommentsService
  ) { }

  ngOnInit(): void {
    this.commentsControl = new FormControl("");
    this.blogId = this.route.snapshot.paramMap.get('id');
    this.userId = this.sessionStorage.getItem("travelT_id");
    this.username = this.sessionStorage.getItem("travelT_username");
    const needCheck = this.utilityService.isAvailable();
    if (needCheck) {
     this.utilityService.checkAuth();
    }
    this.getData();
  }

  showToast(status: any, message: string, ref: string) {
    const position = this.position.TOP_RIGHT;
    this.toastrService.show(ref, message, { position,status });
  }

  getData(){
    if(!this.blogId){
      this.showToast("danger", "Blog post id not found", "Error");
    }
    this.blogPostService.getBlogPostData(this.blogId).subscribe({
      error: error => {
        console.error(error);
        this.showToast("danger", "Blog post not found", "Error");
      },
      next: res => {
        console.log(res);
        this.data = res.payload;
      }
    })
  }

  onSelect(){
    this.isOpened = !this.isOpened;
  }

  sendComment(){
    console.log("value",this.commentsControl.value);
    if(!this.commentsControl.value){
      return;
    }
    this.commentService.addComment(this.commentsControl.value, this.blogId).subscribe({
      error: error => {
        console.error(error);
        if(error.error === 'Access token expired'){
          this.utilityService.openPopup();
        }
      },
      next: res => {
        this.commentsControl.reset();
        this.getData();
      }
    })
  }
}
