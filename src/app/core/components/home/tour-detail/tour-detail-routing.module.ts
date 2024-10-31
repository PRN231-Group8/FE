import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TourDetailComponent } from './tour-detail.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: TourDetailComponent }
	])],
	exports: [RouterModule]
})
export class TourDetailRoutingModule { }
