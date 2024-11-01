import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TransportManagementComponent } from './transport-management.component';


@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: TransportManagementComponent }
	])],
	exports: [RouterModule]
})
export class TransportManagementRoutingModule { }
