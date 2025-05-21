import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BlogPostService} from "../../service/blog-post.service";
import {NbGlobalPhysicalPosition, NbToastrService} from "@nebular/theme";
import {SessionStorageService} from "../../service/session-storage.service";
import {FormControl, FormGroup} from "@angular/forms";
import {UtilityService} from "../../service/utility.service";
import {CommentsService} from "../../service/comments.service";
import {ReactionService} from "../../service/reaction.service";

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
  commentsForm!: FormGroup;
  is_liked: boolean = false;
  is_Authorised: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private blogPostService: BlogPostService,
    private toastrService: NbToastrService,
    private sessionStorage: SessionStorageService,
    private utilityService: UtilityService,
    private commentService: CommentsService,
    private cdr: ChangeDetectorRef,
    private reactionService: ReactionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.commentsControl = new FormControl("");
    this.commentsForm = new FormGroup({});
    this.blogId = this.route.snapshot.paramMap.get('id');
    const needCheck = this.utilityService.isAvailable();
    if (needCheck) {
     this.utilityService.checkAuth();
    }
    this.userId = this.sessionStorage.getItem("travelT_id");
    this.username = this.sessionStorage.getItem("travelT_username");
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
    let fetchMethod = this.blogPostService.getBlogPostData(this.blogId);
    if(this.username || this.userId){
      fetchMethod = this.blogPostService.getProtectedBlogPostData(this.blogId);
    }
    fetchMethod.subscribe({
      error: error => {
        console.error(error);
        this.showToast("danger", "Blog post not found", "Error");
      },
      next: res => {
        console.log(res);
        this.data = null;
        this.data = res.payload;
        this.is_Authorised = !this.checkIsEdit(this.data?.user_id);
        // this.commentsForm.reset();
        this.initiateFormGroup();
        this.cdr.detectChanges();
      }
    })
  }

  onSelect(){
    this.isOpened = !this.isOpened;
  }

  sendComment(){
    if(!this.commentsControl.value){
      this.showToast("Error", "Pl add a comment", "Error");
      return;
    }
    this.commentService.addComment(this.commentsControl.value, this.blogId).subscribe({
      error: error => {
        console.error(error);
        if(error.error === 'Access token expired'){
          this.utilityService.openPopup();
        }
        this.showToast("Error", error.error, "Error");
      },
      next: res => {
        this.showToast("Success","Added", "Success");
        this.commentsControl.reset();
        this.getData();
      }
    });
  }

  initiateFormGroup(){
    this.data.comments.forEach( (comment:any) => {
      this.commentsForm.addControl(comment.id.toString(), new FormControl(comment.comment));
    });
    console.log(this.commentsForm.value);
  }

  checkIsEdit(id:string): boolean {
    if(parseInt(this.userId) === parseInt(id)){
      return false;
    }
    return true;
  }

  updateComment(id:any){
    const comment = this.commentsForm.get(id.toString());
    console.log(comment);
    if(id && comment){
      this.commentService.updateComment(comment.value, id).subscribe({
        error: error => {
          console.error(error);
          if(error.error === 'Access token expired'){
            this.utilityService.openPopup();
          }
          this.showToast("Error", error.error, "Error");
        },
        next: res => {
          this.showToast("Success","Updated", "Success");
          this.getData();
        }
      });
    }
    this.showToast("Error", "Pl add a comment", "Error");
  }

  likeBlog(react:number){
    const is_like = this.data?.is_like;
    if(is_like === null){
      this.addReaction(react);
    }else if(is_like === true && react === 0){
      this.updateReaction(react);
    }else if(is_like === true && react === 1){
      this.removeReaction(react);
    }else if(is_like === false && react === 1){
      this.updateReaction(react);
    }else if(is_like === false && react === 0){
      this.removeReaction(react);
    }
  }

  addReaction(react:number){
    this.reactionService.addReaction(this.blogId, react).subscribe({
        error: error => {
          console.error(error);
          if(error.error === 'Access token expired'){
            this.utilityService.openPopup();
          }
        },
        next: res => {
          this.getData();
        }
    });
  }

  updateReaction(react:number){
    this.reactionService.updateReaction(this.blogId, react).subscribe({
      error: error => {
        console.error(error);
        if(error.error === 'Access token expired'){
          this.utilityService.openPopup();
        }
      },
      next: res => {
        this.getData();
      }
    });
  }

  removeReaction(react:number){
    this.reactionService.removeReaction(this.blogId).subscribe({
      error: error => {
        console.error(error);
        if(error.error === 'Access token expired'){
          this.utilityService.openPopup();
        }
      },
      next: res => {
        this.getData();
      }
    });
  }

  editBlog(){
    this.router.navigate(['/create', this.blogId]);
  }

  deleteBlog(){
    console.log("workongnkdn",this.blogId);
    this.blogPostService.deleteBlogPost(this.blogId).subscribe({
      error: error => {
        console.error(error);
        if(error.error === 'Access token expired'){
          this.utilityService.openPopup();
        }
      },
      next: res => {
        this.router.navigateByUrl("/dashboard");
        this.showToast("success", "Blog post deleted", "Success");
      }
    })
  }

  formatJSON(data:any):any{
    return JSON.parse(data);
  }
}
