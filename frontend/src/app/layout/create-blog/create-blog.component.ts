import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {map, Observable, of, startWith} from "rxjs";
import {SessionStorageService} from "../../service/session-storage.service";
import {CountriesService} from "../../service/countries.service";
import {countryObj} from "../../shared/models/countryDetail";
import {SessionExpiredComponent} from "../popup/session-expired/session-expired.component";
import {NbDialogService, NbGlobalPhysicalPosition, NbToastrService} from "@nebular/theme";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {blogPostData} from "../../shared/models/blogPost";
import {BlogPostService} from "../../service/blog-post.service";
import {UtilityService} from "../../service/utility.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-create-blog',
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.scss']
})
export class CreateBlogComponent implements OnInit {
  options!: string[];
  filteredControlOptions$!: Observable<string[]>;
  countryData : countryObj = {
    name: '',
    languages: [],
    capital: '',
    flag: '',
    currency: '',
    region: ''
  };
  isVisible: boolean = false;
  position = NbGlobalPhysicalPosition;
  formData: FormGroup<any> = this.fb.group({});
  blogId: string = '';
  userId: string = '';
  username: string = '';
  data:any = null;
  isEditing: boolean = false;

  constructor(
    private sessionStorage: SessionStorageService,
    private countryService: CountriesService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private blogpostService: BlogPostService,
    private utilityService: UtilityService,
    private route: ActivatedRoute,
    private blogPostService: BlogPostService,
  ) { }

  ngOnInit(): void {
    this.initiateForm();
    this.route.paramMap.subscribe(param => {
        this.blogId = param.get('id') || '';
    });
    this.options = this.sessionStorage.getItem("nameList") || ['option 1', 'option 2', 'option 3', 'option 4'];
    this.filteredControlOptions$ = of(this.options);
    this.filteredControlOptions$ = this.countryName.valueChanges
      .pipe(
        startWith(''),
        map(filterString => this.filter(filterString)),
      );
    const needCheck = this.utilityService.isAvailable();
    if (needCheck) {
      this.utilityService.checkAuth();
    }
    this.userId = this.sessionStorage.getItem("travelT_id");
    this.username = this.sessionStorage.getItem("travelT_username");
    console.log("this.blogId", this.blogId);
    if(this.blogId !== ''){
      this.getData();
    }
  }

  private filter(value: string) {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  getCountryDetails(){
    console.log("country",this.countryName.value)
    if(this.countryName.value == ""){
      this.showToast("danger", "Please select a country name", "Error");
      return;
    }
    this.countryService.getCountryDetail(this.countryName.value).subscribe({
      error: err => {
        console.log(err)
        if(err?.error === 'Access token expired'){
          this.utilityService.openPopup();
        }
        this.showToast("danger", "Error while fetching country details", "Error");
        this.isVisible = false;
      },
      next: (res) => {
        console.log(res);
        const selectedCountry = res[0];
        this.countryData.name = selectedCountry.name;
        this.countryData.languages = selectedCountry.languages;
        this.countryData.capital = selectedCountry.capital;
        this.countryData.flag = selectedCountry.flag;
        this.countryData.currency = selectedCountry.currency;
        this.countryData.region = selectedCountry.region;
        this.isVisible = true;
        this.cd.detectChanges();
      }
    })
  }

  openPopup(){
    let dialogRef = this.dialogService.open(SessionExpiredComponent);
    dialogRef.componentRef.instance.title = 'test';
  }

  showToast(status: any, message: string, ref: string) {
    const position = this.position.TOP_RIGHT;
    this.toastrService.show(ref, message, { position,status });
  }

  initiateForm(){
    this.formData = this.fb.group({
      title: [''],
      content: [''],
      country: [''],
      date: [''],
    });
  }

  get countryName(){
    return this.formData.get('country') as FormControl;
  }

  saveBlog(){
    console.log("formdata",this.formData);
    const title = this.formData.value.title;
    const content = this.formData.value.content;
    const date = this.formData.value.date;
    // Extract local date without timezone shift
    const formatedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    // const formatedDate = date.toISOString().substr(0, 10) || '';
    console.log("dae", formatedDate);
    if(content === '' || title === '' || formatedDate === '' || this.countryName.value === ''){
      this.showToast("danger", "Blog title, content and country are required", "Error");
      return;
    }
    const blogPostData: blogPostData = {
      title: title,
      content: content,
      date_of_visit: formatedDate
    };
    this.blogpostService.createBlog( {countryData: this.countryData, blogPostData:blogPostData} ).subscribe({
      error: err => {
        this.showToast("danger",err.error, "Error");
      },
      next: (res) => {
        this.showToast("success","Blog post saved", "Success");
      }
    });
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
        // this.is_Authorised = !this.checkIsEdit(this.data?.user_id);
        // this.commentsForm.reset();
        // this.initiateFormGroup();
        // this.cdr.detectChanges();
        this.editWorkflow();
      }
    })
  }

  editWorkflow(){
    this.isEditing = this.blogId !== '';
    this.setFormData();
    this.countryData.region = this.data.region;
    this.countryData.name = this.data.country_name;
    this.countryData.languages = JSON.parse(this.data.languages);
    this.countryData.capital = this.data.capital;
    this.countryData.flag = this.data.flag;
    this.countryData.currency = this.data.currency;
    this.isVisible = true;
    console.log(this.formData.value);
    this.countryName.disable();
    this.cd.detectChanges();
  }

  setFormData(){
    this.formData.patchValue({
      title: this.data?.title,
      content: this.data?.content,
      date: new Date(this.data?.date_of_visit),
      country: this.data?.country_name,
    })
  }

  formatDate(date:string){
    return new Date(Date.UTC(
      new Date(date).getFullYear(),
      new Date(date).getMonth(),
      new Date(date).getDate()
    ));
  }

  forceLocalDate(dateString: string): Date {
    const parts = dateString.split("-");
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }

  saveEdit(){
    console.log("form", this.formData)
    const title = this.formData.value.title;
    const content = this.formData.value.content;
    const date = this.formData.value.date;
    if(content === '' || title === '' || date === '' || this.countryName.value === ''){
      this.showToast("danger", "Blog title, content and country are required", "Error");
      return;
    }
      const update = {
        title: this.formData.value.title,
        content: this.formData.value.content,
        date_of_visit: date.toISOString().substr(0, 10),
      }
      this.blogPostService.updateBlog(update, this.blogId).subscribe({
        error: err => {
          if(err?.error === 'Access token expired'){
            this.utilityService.openPopup();
            this.showToast("danger", "Blog post not found", "Error");
          }
        },
        next: res => {
          this.showToast("success", "Blog post updated", "Success");
        }
      })
  }

}
