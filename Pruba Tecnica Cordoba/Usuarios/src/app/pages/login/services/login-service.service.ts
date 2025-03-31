import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Login, Usuario } from '../../../shared/models/Usuario';
import { ResponseLogin, ResponseSoli } from '../../../shared/models/Response';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  private apiUrl = environment.urlWebApiUsuarios;
  constructor(private http: HttpClient) { }

  Register(Usuario: Usuario){
    return this.http.post<ResponseSoli>(`${this.apiUrl}/api/Login/Registrarse`, Usuario);
  }

  Login(Usuario: Login){
    return this.http.post<ResponseLogin>(`${this.apiUrl}/api/Login/Login`, Usuario);
  }
}
