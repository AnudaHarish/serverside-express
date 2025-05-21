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

  getFollowingList(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/follow/followers`)
  }

  getFollowerList(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/follow/followings`)
  }

  getUserList(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/follow/userList`);
  }

  create(id:any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/follow/create`, {following_id:id})
  }

  unfollow(id:any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/follow/unfollow/${id}`)
  }
}
