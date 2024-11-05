import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourManagementRoutingModule } from './tour-management-routing.module';
import { TourManagementComponent } from './tour-management.component';
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
  declarations: [TourManagementComponent],
  imports: [
    CommonModule,
    TourManagementRoutingModule,
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
  ],
  bootstrap: [TourManagementComponent]
})
export class TourManagementModule { }
