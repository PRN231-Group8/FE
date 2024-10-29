import { NgModule } from '@angular/core';
import { TourManagementComponent } from './tour-management.component';
import { RouterModule } from '@angular/router';


@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: TourManagementComponent }
	])],
	exports: [RouterModule]
})
export class TourManagementRoutingModule { }
