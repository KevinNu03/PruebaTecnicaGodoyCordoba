import { Routes } from "@angular/router";
import { publicRoutes } from "./public-private-routes";
import { authGuard } from "./interceptor/auth.guard";

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
        path: publicRoutes.HOME,
        loadComponent: () => import('../pages/home/home.component').then(c => c.HomeComponent),
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: `/${publicRoutes.LOGIN}`,
    },
]