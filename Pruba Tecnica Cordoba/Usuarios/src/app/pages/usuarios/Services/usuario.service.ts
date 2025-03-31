import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { ResponseDelteUsuario, ResponseGetUsuarios } from '../../../shared/models/Response';
import { UpdateUsuario, Usuario } from '../../../shared/models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = environment.urlWebApiUsuarios;
  constructor(private http: HttpClient) { }

  GetUsuarios(Cedula: string){
    return this.http.get<ResponseGetUsuarios>(`${this.apiUrl}/api/Usuario/GetUsuarios/${Cedula}`);
  }

  
  DeleteUsuario(IdUsuario: number){
    return this.http.delete<ResponseDelteUsuario>(`${this.apiUrl}/api/Usuario/DeleteUsuario/${IdUsuario}`)
  }

  AddUsuarios(Usuario: Usuario){
    return this.http.post<ResponseDelteUsuario>(`${this.apiUrl}/api/Usuario/AddUsuarios`, Usuario);
  }

  UpdateUsuarios(Usuario: UpdateUsuario){
    return this.http.post<ResponseDelteUsuario>(`${this.apiUrl}/api/Usuario/UpdateUsuarios`, Usuario);
  }
}
