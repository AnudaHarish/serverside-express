import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.scss']
})
export class SmartTableComponent implements OnInit {
  @Input() settings:any;
  // @Input() dataSource:LocalDataSource = new LocalDataSource();

  constructor() { }

  ngOnInit(): void {
  }

}
