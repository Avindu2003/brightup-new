import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  NbAuthComponent,
  NbLoginComponent,
  NbLogoutComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from '@nebular/auth';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule),
      canActivate: [AuthGuard]
  },
  {
    path: 'student',
    loadChildren: () => import('./student/student.module')
      .then(m => m.StudentModule),
      canActivate: [AuthGuard]
  },
  {
    path: 'statistics',
    loadChildren: () => import('./statistics/statistics.module')
      .then(m => m.StatisticsModule),
      canActivate: [AuthGuard]
  },
  {
    path: 'reference',
    loadChildren: () => import('./reference/reference.module')
      .then(m => m.ReferenceModule),
      canActivate: [AuthGuard]
  },
  {
    path: 'payment',
    loadChildren: () => import('./payment/payment.module')
      .then(m => m.PaymentModule),
      canActivate: [AuthGuard]
  },
  {
    path: 'converter',
    loadChildren: () => import('./converter/converter.module')
      .then(m => m.ConverterModule),
      canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module')
      .then(m => m.DashboardModule),
      canActivate: [AuthGuard]
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module')
      .then(m => m.NotificationsModule),
      canActivate: [AuthGuard]
  },
  {
    path: 'content-uploads',
    loadChildren: () => import('./content-uploads/content-uploads.module')
      .then(m => m.ConverterModule),
      canActivate: [AuthGuard]
  },
  //  {
  //    path: 'auth',
  //    component: NbAuthComponent,
  //    children: [
  //      {
  //        path: '',
  //        component: NbLoginComponent,
  //      },
  //      {
  //        path: 'login',
  //        component: NbLoginComponent,
  //      },
  //      {
  //        path: 'register',
  //        component: NbRegisterComponent,
  //      },
  //      {
  //        path: 'logout',
  //        component: NbLogoutComponent,
  //      },
  //      {
  //        path: 'request-password',
  //        component: NbRequestPasswordComponent,
  //      },
  //      {
  //        path: 'reset-password',
  //        component: NbResetPasswordComponent,
  //      },
  //    ],
  //  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module')
      .then(m => m.AuthModule),
  },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'student' },
];

const config: ExtraOptions = {
  useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
