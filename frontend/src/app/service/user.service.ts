import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient
  ) { }

  getUserDetails(id:any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user/${id}`);
  }

  updateUser(updateObj:any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/user/update`, updateObj);
  }
}
