import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderHistoryComponent } from './order-history.component';
import { OrderHistoryRoutingModule } from './order-history-routing.module';
import { sharedModule } from '../../../layout/shared/shared.module';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { HttpClientModule } from '@angular/common/http';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';


@NgModule({
  declarations: [OrderHistoryComponent],
  imports: [
    CommonModule,
    OrderHistoryRoutingModule,
    sharedModule,
    TableModule,
    ToastModule,
    ButtonModule,
    DropdownModule,
    PaginatorModule,
    FormsModule,
    InputTextModule,
    DialogModule,
    CalendarModule,
    InputTextareaModule,
    MultiSelectModule,
    ReactiveFormsModule,
    HttpClientModule,
    TagModule,
    ProgressBarModule
  ]
})
export class OrderHistoryModule { }
