import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { VnpayFormComponent } from './vnpay-form.component';
import { SafeUrlPipe } from './safe-url.pipe';

@NgModule({
  declarations: [
    VnpayFormComponent,
    SafeUrlPipe
  ],
  imports: [
    CommonModule,
    DynamicDialogModule
  ],
  exports: [
    VnpayFormComponent
  ]
})
export class VnpayFormModule { }
