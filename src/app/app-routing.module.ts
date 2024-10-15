/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { NotfoundComponent } from './core/components/notfound/notfound.component';
import { HomeComponent } from './core/components/home/layout/home.component';
import { LoginComponent } from './core/components/login/login.component';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: '',
          component: HomeComponent,
          children: [
            {
              path: '',
              loadChildren: () =>
                import('./core/components/home/main/main.module').then(
                  m => m.MainModule,
                ),
            },
          ],
        },
        {
          path: '',
          component: AppLayoutComponent,
          children: [
            {
              path: 'dashboard',
              loadChildren: () =>
                import('./core/components/dashboard/dashboard.module').then(
                  m => m.DashboardModule,
                ),
            },
            {
              path: 'admin',
              loadChildren: () =>
                import('./core/components/pages/pages.module').then(
                  m => m.PagesModule,
                ),
            },
          ],
        },
        {
          path: 'login',
          component: LoginComponent,
        },
        { path: 'notfound', component: NotfoundComponent },
        { path: '**', redirectTo: '/notfound' },
      ],
      {
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
        onSameUrlNavigation: 'reload',
        enableTracing: true
      },
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
