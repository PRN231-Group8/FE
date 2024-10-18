/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { NotfoundComponent } from './core/components/notfound/notfound.component';
import { LoginComponent } from './core/components/login/login.component';
import { LandingComponent } from './core/components/home/landing/landing.component';
import { ExplorationComponent } from './core/components/home/exploration/exploration.component';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: '',
          component: LandingComponent,
          loadChildren: () =>
            import('./core/components/home/landing/landing.module').then(
              m => m.LandingModule,
            ),
        },
        {
          path: 'explore',
          component: ExplorationComponent,
          loadChildren: () =>
            import('./core/components/home/exploration/exploration.module').then(
              m => m.ExplorationModule,
            ),
        },
        {
          path: 'dashboard',
          component: AppLayoutComponent,
          children: [
            {
              path: '',
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
      },
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
