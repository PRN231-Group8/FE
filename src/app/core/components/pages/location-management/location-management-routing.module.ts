import { NgModule } from '@angular/core';
import { LocationManagementComponent } from './location-management.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: LocationManagementComponent },
    ]),
  ],
  exports: [RouterModule],
})
export class LocationManagementRoutingModule {}
