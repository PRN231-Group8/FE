import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-vnpay-form',
  templateUrl: './vnpay-form.component.html',
})
export class VnpayFormComponent implements OnInit {
  url!: string;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.url = this.config.data?.url;
  }

  close(): void {
    this.ref.close();
  }
}
