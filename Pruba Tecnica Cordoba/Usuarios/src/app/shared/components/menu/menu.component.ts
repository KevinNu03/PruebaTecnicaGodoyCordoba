import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MenuItem } from '../../models/Menu';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { publicRoutes } from '../../../core/public-private-routes';
import { LocalStorageService } from '../../Services/local-storage.service';
import { UsuariosComponent } from '../../../pages/usuarios/usuarios.component';

@Component({
  selector: 'app-menu',
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    RouterLink,
    RouterOutlet,
    UsuariosComponent
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ){}
  isOpened = signal(true)
  showUsuarios: boolean = false;

  menuItems: MenuItem[] = [
    { icon: 'home', label: 'Inicio', route: `/${publicRoutes.HOME}` },
    { icon: 'person', label: 'Usuario' },
  ];

  toggleSidenav() {
    this.isOpened.set(!this.isOpened());
  }

  toggleSubmenu(item: MenuItem) {
    item.expanded = !item.expanded;
  }

  logout() {
    this.localStorageService.SetToken('');
    this.router.navigate([`/${publicRoutes.LOGIN}`])
  }

  toggleUsuarios() {
    this.showUsuarios = !this.showUsuarios; 
  }
}
