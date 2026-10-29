import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [{
  path: '',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ]
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {
}
// export const routedComponents = [
  
// ];