import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourDetailComponent } from './tour-detail.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { RouterModule } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ScrollTopModule } from 'primeng/scrolltop';
import { sharedModule } from '../../../../layout/shared/shared.module';
import { GalleriaModule } from 'primeng/galleria';
import { FormsModule } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
@NgModule({
  declarations: [TourDetailComponent],
  imports: [
    CommonModule,
    FullCalendarModule,
    InputTextModule,
    TagModule,
    ButtonModule,
    RippleModule,
    BadgeModule,
    RadioButtonModule,
    InputSwitchModule,
    RippleModule,
    RouterModule,
    ButtonModule,
    ScrollTopModule,
    sharedModule,
    GalleriaModule,
    FormsModule,
    SkeletonModule,
    DynamicDialogModule,
    TooltipModule,
    DividerModule
  ]
})
export class TourDetailModule { }
