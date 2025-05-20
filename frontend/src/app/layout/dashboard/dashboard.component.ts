import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {CountriesService} from "../../service/countries.service";
import {map, Observable, of, startWith} from "rxjs";
import {FormControl} from "@angular/forms";
import {countryObj} from "../../shared/models/countryDetail";
import {NbDialogService, NbGlobalPhysicalPosition, NbToastrService} from "@nebular/theme";
import {SessionStorageService} from "../../service/session-storage.service";
import {SessionExpiredComponent} from "../popup/session-expired/session-expired.component";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {BlogPostService} from "../../service/blog-post.service";

interface BlogPost {
  id: number;
  title: string;
  author: string;
  country: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = ['title', 'author', 'country', 'likes_count', 'comments_count'];
  dataSource = new MatTableDataSource<BlogPost>([]);
  options!: string[];
  filteredControlOptions$!: Observable<string[]>;
  countryName! : FormControl;
  isVisible: boolean = false;
  position = NbGlobalPhysicalPosition;
  countryObj : countryObj = {
    name: '',
    languages: [],
    capital: '',
    flag: '',
    currency: '',
    region: ''
  }
  currentPage = 1;
  pageSize = 10;
  sortOption = 'newest';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // dataSource: LocalDataSource = new LocalDataSource();
  settings:any = null;
  queryObj : any = {
    username: '',
    country: '',
    page: 1,
    size: 10,
    sort: 'newest'
  };
  constructor(
    private countryService: CountriesService,
    private cd: ChangeDetectorRef,
    private toastrService: NbToastrService,
    private sessionStorage: SessionStorageService,
    private dialogService: NbDialogService,
    private blogPostService: BlogPostService,) { }

  ngOnInit(): void {
    this.countryName = new FormControl("");
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


  getDefault(){
    this.countryService.default().subscribe({
      error: err => console.log(err),
      next: (res) => console.log(res),
    });
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
        this.countryObj.name = selectedCountry.name;
        this.countryObj.languages = selectedCountry.languages;
        this.countryObj.capital = selectedCountry.capital;
        this.countryObj.flag = selectedCountry.flag;
        this.countryObj.currency = selectedCountry.currency;
        this.isVisible = true;
        this.cd.detectChanges();
      }
    })
  }

  showToast(status: any, message: string, ref: string) {
    const position = this.position.TOP_RIGHT;
    this.toastrService.show(ref, message, { position,status });
  }

  openPopup(){
    let dialogRef = this.dialogService.open(SessionExpiredComponent);
    dialogRef.componentRef.instance.title = 'test';
  }

  fetchData(){
    this.blogPostService.search({
      page: this.currentPage,
      size: this.pageSize,
      sort: this.sortOption
      // pass in country and username filters as needed
    }).subscribe(response => {
      this.dataSource.data = response.payload;
      // you might also update paginator length here, e.g., response.metadata.total
    });
  }

  onSortChange(event: any) {
    // Update the sort option based on the column sorted and direction
    // You could map MatSort changes to your sort options (e.g., newest, mostLiked, etc.)
    this.sortOption = event.active === 'likes_count' ? 'mostLiked' :
      event.active === 'comments_count' ? 'mostCommented' :
        'newest';
    this.fetchData();
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.fetchData();
  }
}
