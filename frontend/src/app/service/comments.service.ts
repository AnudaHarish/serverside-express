import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  baseUrl = environment.baseUrl;
  constructor(
    private http: HttpClient
  ) { }

  addComment(comment:any, id:any): Observable<any> {
    return this.http.post(`${this.baseUrl}/comments/create/${id}`,{comment: comment});
  }

  updateComment(comment:any, id:any): Observable<any> {
    return this.http.put(`${this.baseUrl}/comments/update/${id}`,{comment: comment});
  }
}
