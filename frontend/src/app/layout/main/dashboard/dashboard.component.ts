import { Component, OnInit } from '@angular/core';
import {CountriesService} from "../../../service/countries.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private countryService: CountriesService) { }

  ngOnInit(): void {
    this.getDefault();
  }

  getDefault(){
    this.countryService.default().subscribe({
      error: err => console.log(err),
      next: (res) => console.log(res),
    });
  }

}
