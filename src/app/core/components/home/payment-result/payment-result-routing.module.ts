import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PaymentResultComponent } from './payment-result.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: PaymentResultComponent }
	])],
	exports: [RouterModule]
})
export class PaymentResultRoutingModule { }
