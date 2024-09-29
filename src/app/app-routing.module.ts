/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { NotfoundComponent } from './core/components/notfound/notfound.component';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: '',
          loadChildren: () =>
            import('./core/components/landing/landing.module').then(
              (m) => m.LandingModule,
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
                  (m) => m.DashboardModule,
                ),
            },
            {
              path: 'pages',
              loadChildren: () =>
                import('./core/components/pages/pages.module').then(
                  (m) => m.PagesModule,
                ),
            },
          ],
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
