import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserFollowerService {
  baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient,
  ) { }

  getFollowingList(){
  }

  getUserList(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/follow/userList`);
  }

  create(id:any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/follow/create`, {following_id:id})
  }
}
