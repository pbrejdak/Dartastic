import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppShellComponent } from './app-shell/app-shell.component';
import { LandingComponent } from './landing/landing.component';

const routes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    children: [
      {
        path: 'user-managment',
        loadChildren: () => import('./user-managment/user-managment.module').then(mod => mod.UserManagmentModule)
      },
      {
        path: 'skirmish',
        loadChildren: () => import('./skirmish/skirmish.module').then(mod => mod.SkirmishModule)
      },
      {
        path: 'landing',
        component: LandingComponent
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'landing'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
