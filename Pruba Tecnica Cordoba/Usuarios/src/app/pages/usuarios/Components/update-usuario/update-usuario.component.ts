import { Component, Inject, signal } from '@angular/core';
import { ModalInfoComponent } from '../../../../shared/components/modal-info/modal-info.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UsuarioService } from '../../Services/usuario.service';
import { GetUsuario, UpdateUsuario, Usuario } from '../../../../shared/models/Usuario';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { tap } from 'rxjs';

@Component({
  selector: 'app-update-usuario',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './update-usuario.component.html',
  styleUrl: './update-usuario.component.css'
})
export class UpdateUsuarioComponent {
  registerForm: FormGroup;
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);
  passwordMatch: boolean = false;
  puntaje: number = 0;

  private dominiosPuntos: Record<string, number> = {
    'gmail.com': 40,
    'hotmail.com': 20
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public dialogRef: MatDialogRef<ModalInfoComponent>,
    public dialog: MatDialog,
    private usuarioService: UsuarioService,
    @Inject(MAT_DIALOG_DATA) public data: GetUsuario 
  ){
    this.registerForm = this.fb.group({
      Nombre: [data.nombre, [Validators.required, Validators.maxLength(100)]] ,
      Apellido: [data.apellido, [Validators.required, Validators.maxLength(100)]] ,
      Cedula: [data.cedula, [Validators.required, Validators.max(999999999999999)]] ,
      CorreoElectronico : [data.correoElectronico, [Validators.required, Validators.maxLength(100), Validators.email]] ,
      Contrasena: ['', ] ,
      confirmarContrasena : ['',] ,
    });
  }

  onChangePaswword(event: Event){
    const value  = (event.target as HTMLInputElement).value;
    const password = this.registerForm.get("Contrasena")?.value;
    if(value != password) {
      this.passwordMatch = true;
    }
    else{
      this.passwordMatch = false;
    }
  }

  onCreate() {
    this.puntaje = 0;
    //calcular puntaje, se calcula la lonjitud del nombre completo
    const lengthNombre = String(this.registerForm.get("Nombre")?.value).length ;
    const lengthApellido = String(this.registerForm.get("Apellido")?.value).length;

    // se realizan las validaciones
    // Más de 10 caracteres en el nombre completo: +20 puntos.
    // Entre 5 y 10 caracteres: +10 puntos.
    // Menos de 5 caracteres: +0 puntos. no se pone esta validacion ya que si es diferente a alguna de las validaciones no suma
    if((lengthNombre + lengthApellido) > 10){
      this.puntaje += 20
    }
    else if(lengthNombre >= 5 && lengthNombre <= 10){
      this.puntaje += 10
    }

    //validacion Correo
    // gmail.com: +40 puntos.
    // hotmail.com: +20 puntos.
    // Otros: +10 puntos.
    //se realiza la creacion de un arreglo donde se asingan los puntos y el nombre del dominio si lo encuentra le suma los puntos si no existe en el arreglo le pone 10
    const dominioCorreo = String(this.registerForm.get("CorreoElectronico")?.value).split('@')[1];
    this.puntaje += this.dominiosPuntos[dominioCorreo] ?? 10;


    const Usuario: UpdateUsuario = {
      nombre: String(this.registerForm.get("Nombre")?.value),
      apellido: String(this.registerForm.get("Apellido")?.value),
      cedula: String(this.registerForm.get("Cedula")?.value),
      correoElectronico: String(this.registerForm.get("CorreoElectronico")?.value),
      contrasena: String(this.registerForm.get("Contrasena")?.value) == "" ? "null" : String(this.registerForm.get("Contrasena")?.value),
      puntaje: this.puntaje,
      idUsuario: this.data.idUsuario
    }

    this.usuarioService.UpdateUsuarios(Usuario)
    .pipe(
      tap(response => {
        this.openModal(response.message);
        this.dialogRef.close(false);
      })
    )
    .subscribe({
      next: () => {
      },
      error: (err) => {
        console.log(err)
        this.openModal(err);
      }
    });
  }

  CloseModal() {
    this.dialog.closeAll();
  }

  openModal(Messsage: string){
    const dialogRef = this.dialog.open(ModalInfoComponent, { width: '400px' });
    dialogRef.componentInstance.message = Messsage;

    dialogRef.afterClosed().subscribe(() => {
      this.dialog.closeAll();
    })
  }
}
