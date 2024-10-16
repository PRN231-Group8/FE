import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { ScrollTopModule } from 'primeng/scrolltop';
import { CommonModule } from '@angular/common';
import { sharedModule } from '../../../../layout/shared/shared.module';
import { DropdownModule } from 'primeng/dropdown';
import { ImageModule } from 'primeng/image';
import { NgxAnimatedCounterModule } from '@bugsplat/ngx-animated-counter';
import { TabViewModule } from 'primeng/tabview';
import { RatingModule } from 'primeng/rating';
import { LandingComponent } from './landing.component';
import { LandingRoutingModule } from './landing-routing.module';
import { InputNumberModule } from 'primeng/inputnumber';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';

@NgModule({
  declarations: [LandingComponent],
  imports: [
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    InputTextModule,
    BadgeModule,
    RadioButtonModule,
    InputSwitchModule,
    RippleModule,
    RouterModule,
    ButtonModule,
    ScrollTopModule,
    CommonModule,
    DropdownModule,
    ImageModule,
    NgxAnimatedCounterModule,
    LandingRoutingModule,
    TabViewModule,
    RatingModule,
    sharedModule,
    DataViewModule,
    TagModule,
    InputNumberModule,
    SkeletonModule
  ],
  exports: [LandingComponent],
})
export class LandingModule {}
