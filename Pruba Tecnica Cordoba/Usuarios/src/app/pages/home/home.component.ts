import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../../shared/components/menu/menu.component';
import { LocalStorageService } from '../../shared/Services/local-storage.service';
import { Router, RouterModule } from '@angular/router';
import { publicRoutes } from '../../core/public-private-routes';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MenuComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
  ){}
  ngOnInit(){
    const Token = this.localStorageService.GetToken();

    if(Token == null || Token == ''){
      // this.router.navigate([`/${publicRoutes.LOGIN}`])
    }
  }
}
