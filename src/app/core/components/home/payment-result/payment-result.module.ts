import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentResultComponent } from './payment-result.component';
import { sharedModule } from '../../../../layout/shared/shared.module';
import { PaymentResultRoutingModule } from './payment-result-routing.module';
import { ScrollTopModule } from 'primeng/scrolltop';
import { ButtonModule } from 'primeng/button';


@NgModule({
  declarations: [PaymentResultComponent],
  imports: [
    CommonModule,
    sharedModule,
    PaymentResultRoutingModule,
    ScrollTopModule,
    ButtonModule
  ]
})
export class PaymentResultModule { }
