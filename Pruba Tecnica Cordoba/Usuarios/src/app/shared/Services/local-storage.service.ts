import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }
  //guardamos el token
  SetToken(token: string){
    localStorage.setItem("token", token);
  }
  //llamamos el token
  GetToken(){
    const token = localStorage.getItem("token");

    return token;
  }

  saveIndexPage(page: string) {
    localStorage.setItem('indexPage', page);
  }

  getIndexPage(){
    const page = localStorage.getItem('indexPage');
    return page;
  }
}
