import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginServiceService } from '../../services/login-service.service';
import { Usuario } from '../../../../shared/models/Usuario';
import { tap } from 'rxjs';
import { ModalInfoComponent } from '../../../../shared/components/modal-info/modal-info.component';

@Component({
  selector: 'app-modal-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './modal-register.component.html',
  styleUrl: './modal-register.component.css'
})
export class ModalRegisterComponent {
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
    private loginService: LoginServiceService
  ){
    this.registerForm = this.fb.group({
      Nombre: ['', [Validators.required, Validators.maxLength(100)]] ,
      Apellido: ['', [Validators.required, Validators.maxLength(100)]] ,
      Cedula: ['', [Validators.required, Validators.max(999999999999999)]] ,
      CorreoElectronico : ['', [Validators.required, Validators.maxLength(100), Validators.email]] ,
      Contrasena: ['', [Validators.required, Validators.minLength(8)]] ,
      confirmarContrasena : ['', [Validators.required, Validators.minLength(8)]] ,
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

  onRegister() {
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


    const Usuario: Usuario = {
      nombre: String(this.registerForm.get("Nombre")?.value),
      apellido: String(this.registerForm.get("Apellido")?.value),
      cedula: String(this.registerForm.get("Cedula")?.value),
      correoElectronico: String(this.registerForm.get("CorreoElectronico")?.value),
      contrasena: String(this.registerForm.get("Contrasena")?.value),
      puntaje: this.puntaje,
    }

    this.loginService.Register(Usuario)
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

  goToLogin() {
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
