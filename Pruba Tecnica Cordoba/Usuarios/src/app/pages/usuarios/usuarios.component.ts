import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { TableUsuarioComponent } from './Components/table-usuario/table-usuario.component';

@Component({
  selector: 'app-usuarios',
  imports: [
    CommonModule,
    TableUsuarioComponent
  ],
  templateUrl: './usuarios.component.html',
})
export class UsuariosComponent{
  
}
