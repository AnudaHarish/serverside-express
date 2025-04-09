import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {catchError, map, throwError} from "rxjs";
import * as http from "node:http";

@Injectable({
  providedIn: 'root'
})
export class CountriesService {
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  default(){
    return this.http.get<any>(
      `${this.baseUrl}`
    ).pipe(
      map(response => { return response}),
      catchError((err) => {return throwError(err)})
    );
  }

  getCountryNames() {
    return this.http.get<any>(`${this.baseUrl}/countries/nameList`).pipe(
      map(response => { return response}),
      catchError((err) => {return throwError(err)})
    );
  }

  getCountryDetail(name: string) {
    return this.http.get<any>(`${this.baseUrl}/countries/${name}`).pipe(
      map(response => { return response}),
      catchError((err) => {return throwError(err)})
    );
  }
}
