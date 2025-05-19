import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  isLoggedIn: boolean = false;

  constructor() { }

  setKey(key: string, value:any){
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  getItem(key: string){
    return JSON.parse(sessionStorage.getItem(key) || "null");
  }

  removeItem(key: string){
    sessionStorage.removeItem(key);
  }

  clear(){
    sessionStorage.clear();
  }

  checkUser(){
    const id = this.getItem('travelT_id');
    const username = this.getItem('travelT_username');
    console.log("id", id);
    if(id === null || username === null){
      return this.isLoggedIn = false;
    }else{
      return this.isLoggedIn = true;
    }
  }
}
