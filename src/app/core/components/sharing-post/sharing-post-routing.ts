import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharingPostComponent } from './sharing-post.component';

@NgModule({
  imports: [
    RouterModule.forChild([{ path: '', component: SharingPostComponent }]),
  ],
  exports: [RouterModule],
})
export class SharingPostRoutingModule {}
