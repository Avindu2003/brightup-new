import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';

import { ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbMenuModule, NbSpinnerModule } from '@nebular/theme';
import { ThemeModule } from '../@theme/theme.module';
import { AuthComponent } from './auth.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';


@NgModule({
  declarations: [
    LoginComponent,
    AuthComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    NbCardModule,
    NbMenuModule.forRoot(),
    ThemeModule,
    NbSpinnerModule
    
  ],
  providers: []
})
export class AuthModule { }
