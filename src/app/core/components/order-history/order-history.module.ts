import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderHistoryComponent } from './order-history.component';
import { OrderHistoryRoutingModule } from './order-history-routing.module';
import { sharedModule } from '../../../layout/shared/shared.module';
import { ToastModule } from 'primeng/toast';


@NgModule({
  declarations: [OrderHistoryComponent],
  imports: [
    CommonModule,
    OrderHistoryRoutingModule,
    sharedModule,
    ToastModule,
  ]
})
export class OrderHistoryModule { }
