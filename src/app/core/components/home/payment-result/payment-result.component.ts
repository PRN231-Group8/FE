import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../../../services/payment.service';
import { ActivatedRoute } from '@angular/router';
import { VnPayQuery } from '../../../../interfaces/models/query/vnpay-query';

@Component({
  selector: 'app-payment-result',
  templateUrl: './payment-result.component.html',
})
export class PaymentResultComponent implements OnInit {
  isSuccessPayment: boolean = false;
  VnpayQuery!: VnPayQuery;

  constructor(
    private paymentService: PaymentService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
