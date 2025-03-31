import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { ModalRegisterComponent } from './components/modal-register/modal-register.component';
import { Login } from '../../shared/models/Usuario';
import { LoginServiceService } from './services/login-service.service';
import { tap } from 'rxjs';
import { ModalInfoComponent } from '../../shared/components/modal-info/modal-info.component';
import { publicRoutes } from '../../core/public-private-routes';
import { LocalStorageService } from '../../shared/Services/local-storage.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  hide = true; 

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private loginService: LoginServiceService,
    private localStorageService: LocalStorageService
  ) {
    this.loginForm = this.fb.group({
      correoElectronico: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onLogin() {
    const UserLogin: Login = {
      correoElectronico: this.loginForm.get('correoElectronico')?.value,
      Contrasena: this.loginForm.get('contrasena')?.value
    }

    this.loginService.Login(UserLogin)
    .pipe(
      tap(response => {
        if(response.isSuccess){
          this.localStorageService.SetToken(String(response.token))
        }
        this.openModal(response.message);
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

  goToRegister(){
    this.dialog.open(ModalRegisterComponent, {
      width: 'auto',
      maxWidth: '90vw', 
      height: 'auto',
      maxHeight: '80vh', 
    });
  }

  openModal(Messsage: string){
    const dialogRef = this.dialog.open(ModalInfoComponent, { width: '400px' });
    dialogRef.componentInstance.message = Messsage;

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate([`/${publicRoutes.HOME}`]);
    })
  }

}
