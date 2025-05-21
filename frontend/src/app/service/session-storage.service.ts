import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {AuthInterceptor} from "../interceptors/auth.interceptor";

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  isLoggedIn: boolean = false;
  private sessionUpdate = new BehaviorSubject<boolean>(false);
  sessionUpdate$ = this.sessionUpdate.asObservable();

  constructor() { }

  setKey(key: string, value:any){
    sessionStorage.setItem(key, JSON.stringify(value));
    this.sessionUpdate.next(true);
  }

  getItem(key: string) :any |null{
    const value = sessionStorage.getItem(key);
    console.log("value", typeof value)
    if(value === "null" || value === "undefined" || !value){
      return null;
    }
    return JSON.parse(value);
  }

  removeItem(key: string){
    sessionStorage.removeItem(key);
    this.sessionUpdate.next(true);
  }

  clear(){
    sessionStorage.clear();
    this.sessionUpdate.next(true);
  }

  checkUser(){
    const id = this.getItem('travelT_id');
    const username = this.getItem('travelT_username');
    console.log("id", id);
    this.isLoggedIn = !!(id && username);
    return this.isLoggedIn;
  }
}
