/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { NotfoundComponent } from './core/components/notfound/notfound.component';
import { LoginComponent } from './core/components/login/login.component';
import { LandingComponent } from './core/components/home/landing/landing.component';
import { ExplorationComponent } from './core/components/home/exploration/exploration.component';
import { VerifyEmailComponent } from './core/components/verify-email/verify-email.component';
import { ProfileComponent } from './core/components/profile/profile.component';
import { AuthGuard } from './_helper/auth.guard';
import { TourDetailComponent } from './core/components/home/tour-detail/tour-detail.component';
import { PaymentResultComponent } from './core/components/home/payment-result/payment-result.component';
import { OrderHistoryComponent } from './core/components/order-history/order-history.component';

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
          canActivate: [AuthGuard]
        },
        {
          path: 'login',
          component: LoginComponent,
        },
        {
          path: 'verify-email',
          component: VerifyEmailComponent,
        },
        {
          path: 'profile',
          component: ProfileComponent,
          loadChildren: () =>
            import('./core/components/profile/profile.module').then(
              m => m.ProfileModule,
            ),
        },
        {
          path: 'tour-detail/:id',
          component: TourDetailComponent,
          loadChildren: () =>
            import('./core/components/home/tour-detail/tour-detail.module').then(
              m => m.TourDetailModule,
            ),
        },
        {
          path: 'payment-result',
          component: PaymentResultComponent,
          loadChildren: () =>
            import('./core/components/home/payment-result/payment-result.module').then(
              m => m.PaymentResultModule,
            ),
        },
        {
          path: 'order',
          component: OrderHistoryComponent,
          loadChildren: () =>
            import('./core/components/order-history/order-history.module').then(
              m => m.OrderHistoryModule,
            ),
        },
        { path: 'notfound', component: NotfoundComponent },
        { path: '**', redirectTo: '/notfound' },
      ],
      {
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
        onSameUrlNavigation: 'reload',
        useHash: true,
      },
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
