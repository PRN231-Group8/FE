import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransportManagementComponent } from './transport-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TransportManagementRoutingModule } from './transport-management-routing.module';


@NgModule({
  declarations: [TransportManagementComponent],
  imports: [
    CommonModule,
    TransportManagementRoutingModule,
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
    ReactiveFormsModule
  ]
})
export class TransportManagementModule { }
