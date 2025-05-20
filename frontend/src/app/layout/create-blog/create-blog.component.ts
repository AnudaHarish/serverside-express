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

  constructor(
    private sessionStorage: SessionStorageService,
    private countryService: CountriesService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private blogpostService: BlogPostService,
  ) { }

  ngOnInit(): void {
    this.initiateForm();
    this.options = this.sessionStorage.getItem("nameList") || ['option 1', 'option 2', 'option 3', 'option 4'];
    this.filteredControlOptions$ = of(this.options);
    this.filteredControlOptions$ = this.countryName.valueChanges
      .pipe(
        startWith(''),
        map(filterString => this.filter(filterString)),
      );
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
          this.openPopup();
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
      date: [new Date()]
    });
  }

  get countryName(){
    return this.formData.get('country') as FormControl;
  }

  saveBlog(){
    const title = this.formData.value.title;
    const content = this.formData.value.content;
    const date = this.formData.value.date;
    const formatedDate = new Date(date).toISOString().substr(0, 10) || '';
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

    console.log("blogPostData", blogPostData);
    this.blogpostService.createBlog( {countryData: this.countryData, blogPostData:blogPostData} ).subscribe({
      error: err => {
        console.log(err)
      },
      next: (res) => {
        console.log(res)
      }
    })
  }

}
