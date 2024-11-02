import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourDetailComponent } from './tour-detail.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';


@NgModule({
  declarations: [TourDetailComponent],
  imports: [
    CommonModule,
    FullCalendarModule,
    InputTextModule,
    TagModule,
    ButtonModule,
    RippleModule
  ]
})
export class TourDetailModule { }
