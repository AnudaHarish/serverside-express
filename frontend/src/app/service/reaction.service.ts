import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReactionService {
  baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient
  ) { }

  addReaction(id:any, isLike:any):Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/react/add/${id}`,{is_like:isLike});
  }

  removeReaction(id:any):Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/react/remove/${id}`);
  }

  updateReaction(id:any, isLike:any):Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/react/update/${id}`,{is_like:isLike});
  }


}
