import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationManagementComponent } from './location-management.component';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { LocationManagementRoutingModule } from './location-management-routing.module';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { ProgressBarModule } from 'primeng/progressbar';

@NgModule({
  declarations: [LocationManagementComponent],
  imports: [
    CommonModule,
    ButtonModule,
    DropdownModule,
    DialogModule,
    FormsModule,
    ToastModule,
    TableModule,
    PaginatorModule,
    InputTextModule,
    LocationManagementRoutingModule,
    InputTextareaModule,
    ReactiveFormsModule,
    FileUploadModule,
    ImageModule,
    ProgressBarModule
  ]
})
export class LocationManagementModule { }
