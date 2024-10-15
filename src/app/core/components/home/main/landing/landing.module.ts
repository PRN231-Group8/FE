import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxAnimatedCounterModule } from '@bugsplat/ngx-animated-counter';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ImageModule } from 'primeng/image';
import { InputNumberModule } from 'primeng/inputnumber';
import { RatingModule } from 'primeng/rating';
import { SkeletonModule } from 'primeng/skeleton';
import { TabViewModule } from 'primeng/tabview';
import { LandingComponent } from './landing.component';
import { LandingRoutingModule } from './landing-routing.module';

@NgModule({
    declarations: [LandingComponent],
    imports: [
      CommonModule,
      ImageModule,
      BrowserModule,
      ButtonModule,
      RatingModule,
      FormsModule,
      NgxAnimatedCounterModule,
      SkeletonModule,
      TabViewModule,
      LandingRoutingModule,
      BadgeModule,
      AvatarModule,
      DropdownModule,
      InputNumberModule,
    ],
  })
export class LandingModule {}