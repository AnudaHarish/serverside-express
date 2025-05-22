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
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {UtilityService} from "../../service/utility.service";

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
  displayedColumns: string[] = ['title', 'author', 'country', 'created_at', 'likes_count', 'dislikes_count', 'comments_count'];
  dataSource = new MatTableDataSource<BlogPost>([]);
  options!: string[];
  filteredControlOptions$!: Observable<string[]>;
  filterNameOptions$!: Observable<string[]>;
  countryName! : FormControl;
  userName!: FormControl;
  isVisible: boolean = false;
  position = NbGlobalPhysicalPosition;
  filterControl!: FormControl;
  pageSizeControl!: FormControl;
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
  totalPages = 0;
  totalRecords = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  usernameList: string[] = [];

  constructor(
    private countryService: CountriesService,
    private cd: ChangeDetectorRef,
    private toastrService: NbToastrService,
    private sessionStorage: SessionStorageService,
    private dialogService: NbDialogService,
    private blogPostService: BlogPostService,
    private userService: AuthService,
    private router: Router,
    private utilityService: UtilityService,
  ) { }

  ngOnInit(): void {
    this.countryName = new FormControl("");
    this.userName = new FormControl("");
    this.filterControl = new FormControl("newest");
    this.pageSizeControl = new FormControl(JSON.stringify(this.pageSize));
    this.options = this.sessionStorage.getItem("nameList") || ['option 1', 'option 2', 'option 3', 'option 4'];
    const needCheck = this.utilityService.isAvailable();
    if (needCheck) {
      this.utilityService.checkAuth();
    }
    this.getUserNameList();
    this.filteredControlOptions$ = of(this.options);
    this.filteredControlOptions$ = this.countryName.valueChanges
      .pipe(
        startWith(''),
        map(filterString => this.filter(filterString)),
      );
    this.filterNameOptions$ = this.userName.valueChanges
    .pipe(
      startWith(''),
      map(filterString => this.filterName(filterString)),
    )
    this.fetchData();
  }

  private filter(value: string) {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  private filterName(value: string) {
    const filterValue = value.toLowerCase();
    return this.usernameList.filter(option => option.toLowerCase().includes(filterValue));
  }


  getDefault(){
    this.countryService.default().subscribe({
      error: err => console.log(err),
      next: (res) => console.log(res),
    });
  }

  getCountryDetails(){
    this.fetchData();
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
      country: this.countryName.value,
      username: this.userName.value,
      page: this.currentPage,
      size: this.pageSize,
      sort: this.sortOption
    }).subscribe(response => {
      this.dataSource.data = response?.payload;
      this.totalPages = response?.metadata?.totalPages;
      this.totalRecords = response?.metadata?.total;
    });
  }

  onSortChange(event: any) {
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

  onRowClick(row:any){
    console.log("row", row);
    this.router.navigate(["/view", row.id])
  }

  onPageSizeChange() {
    this.pageSize = parseInt(this.pageSizeControl.value);
    this.fetchData();
  }

  getUserNameList(){
    this.userService.userList().subscribe({
      error: err => console.log(err),
      next: (res) => {
        this.usernameList = res?.payload;
        this.filterNameOptions$ = of(this.usernameList);
      }
    });
  }

  filterChange(){
    this.sortOption = this.filterControl.value;
    this.fetchData();
  }
}
