import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {SearchQuery} from "../shared/models/blogPost";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BlogPostService {
  baseUrl: string = environment.baseUrl;
  constructor(
    private http: HttpClient,
  ) { }

  search(queryObj: SearchQuery): Observable<any> {
    const params = new HttpParams()
      .set("country", queryObj.country)
      .set("username", queryObj.username)
      .set("page", queryObj.page.toString())
      .set("size", queryObj.size.toString())
      .set("sort", queryObj.sort);
    return this.http.get(`${this.baseUrl}/defaults/search`, {params});
  }

  createBlog(data:any):Observable<any>{
    return this.http.post(`${this.baseUrl}/pBlog/create`, data);
  }

  getBlogPostData(id:any):Observable<any>{
    return this.http.get(`${this.baseUrl}/defaults/blog/${id}`).pipe()
  }
}
