import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentResultComponent } from './payment-result.component';
import { sharedModule } from '../../../../layout/shared/shared.module';
import { PaymentResultRoutingModule } from './payment-result-routing.module';
import { ScrollTopModule } from 'primeng/scrolltop';


@NgModule({
  declarations: [PaymentResultComponent],
  imports: [
    CommonModule,
    sharedModule,
    PaymentResultRoutingModule,
    ScrollTopModule
  ]
})
export class PaymentResultModule { }
