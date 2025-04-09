import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CountriesService} from "../../../service/countries.service";
import {map, Observable, startWith} from "rxjs";
import {FormControl} from "@angular/forms";
import {countryObj} from "../../../shared/models/countryDetail";
import {NbGlobalPhysicalPosition, NbToastrService} from "@nebular/theme";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
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
    currency: ''
  }
  constructor(
    private countryService: CountriesService,
    private cd: ChangeDetectorRef,
    private toastrService: NbToastrService) { }

  ngOnInit(): void {
    this.getDefault();
    this.getCountryName();
    this.countryName = new FormControl("");
    this.options = ['option 1', 'option 2', 'option 3', 'option 4'];
    // this.filteredControlOptions$ = of(this.options);
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

  getCountryName(){
    this.countryService.getCountryNames().subscribe({
      error: err => {
        this.isVisible = false;
        console.log(err)},
      next: (res) => {
        console.log(res);
        this.options = res;
        this.filteredControlOptions$ = this.countryName.valueChanges
          .pipe(
            startWith(''),
            map(filterString => this.filter(filterString)),
          );
        this.cd.detectChanges();
      },
    })
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

}
