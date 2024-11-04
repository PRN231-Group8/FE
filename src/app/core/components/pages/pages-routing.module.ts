/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'crud',
        loadChildren: () =>
          import('./crud/crud.module').then(m => m.CrudModule),
      },
      {
        path: 'tour',
        loadChildren: () =>
          import('./tour-management/tour-management.module').then(
            m => m.TourManagementModule,
          ),
      },
      {
        path: 'location',
        loadChildren: () =>
          import('./location-management/location-management.module').then(
            m => m.LocationManagementModule,
          ),
      },
      {
        path: 'transportation',
        loadChildren: () =>
          import('./transport-management/transport-management.module').then(
            m => m.TransportManagementModule,
          ),
      },
    ]),
  ],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
