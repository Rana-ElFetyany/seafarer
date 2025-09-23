import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SeafarersListComponent } from './components/seafarers-list/seafarers-list.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'seafarers-list', component: SeafarersListComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
];

