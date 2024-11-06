import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../../../services/payment.service';
import { ActivatedRoute } from '@angular/router';
import { VnPayQuery } from '../../../../interfaces/models/query/vnpay-query';
import { CallbackResponse } from '../../../../interfaces/models/callback-response';
import { BaseResponse } from '../../../../interfaces/models/base-response';

@Component({
  selector: 'app-payment-result',
  templateUrl: './payment-result.component.html',
})
export class PaymentResultComponent implements OnInit {
  isSuccessPayment: boolean = false;
  vnPayQuery!: VnPayQuery;
  queryString: string = '';
  totalAmountTransaction: number = 0;
  orderId: string = '';
  orderDescription: string = '';
  message: string = '';

  constructor(
    private paymentService: PaymentService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // Extract query parameters from the URL
    this.route.queryParams.subscribe(params => {
      this.vnPayQuery = { ...params } as VnPayQuery;
      this.queryString = new URLSearchParams(params).toString();
      // Call the callback API with the extracted query data
      this.paymentService.callBack(this.queryString).subscribe({
        next: (response: BaseResponse<CallbackResponse>) => {
          this.isSuccessPayment = response.result?.success as boolean;
          this.totalAmountTransaction = response.result?.amount as number;
          this.orderId = response.result?.orderId as string;
          this.orderDescription = response.result?.orderDescription as string;
          this.message = response.result?.message as string;
        },
        error: (error) => {
          this.isSuccessPayment = error.result?.success as boolean;
          this.message = error.result?.message as string;
          console.error('Payment processing failed', error);
        }
      });
    });
  }
}
