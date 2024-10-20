import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: ProfileComponent }])],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
