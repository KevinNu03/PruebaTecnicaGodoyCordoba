import { Routes } from "@angular/router";
import { publicRoutes } from "./public-private-routes";
import { authGuard } from "./interceptor/auth.guard";
import { MenuComponent } from "../shared/components/menu/menu.component";

export const routes: Routes = [
    {
        path: '',
        redirectTo: `/${publicRoutes.LOGIN}`,
        pathMatch: 'full'
    },
    {
        path: publicRoutes.LOGIN,
        loadComponent: () => import('../pages/login/login.component').then(c => c.LoginComponent)
    },
    {
        //se agrega aca los que deben aparecer en el menu
        path: '',
        component: MenuComponent,
        children: [
            {
                path: 'menu',
                loadComponent: () => import('../pages/home/home.component').then(c => c.HomeComponent),
            },
            {
                path: publicRoutes.USUARIO,
                loadComponent: () => import('../pages/usuarios/usuarios.component').then(c => c.UsuariosComponent),
            }
        ],
        canActivate: [authGuard],
    },
    {
        path: publicRoutes.HOME,
        loadComponent: () => import('../pages/home/home.component').then(c => c.HomeComponent),
        canActivate: [authGuard],
    },
    {
        path: '**',
        redirectTo: `/${publicRoutes.LOGIN}`,
    },
]