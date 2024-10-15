import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LandingModule } from './landing/landing.module';
import { ExplorationModule } from '../exploration/exploration.module';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        loadChildren: (): Promise<typeof LandingModule> =>
          import('./landing/landing.module').then(m => m.LandingModule),
      },
      {
        path: 'explore',
        loadChildren: (): Promise<typeof ExplorationModule> =>
          import('../exploration/exploration.module').then(m => m.ExplorationModule),
      },
    ]),
  ],
  exports: [RouterModule],
})
export class MainRoutingModule {}
