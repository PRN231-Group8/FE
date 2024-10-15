import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { BrowserModule } from '@angular/platform-browser';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { NgxAnimatedCounterModule } from '@bugsplat/ngx-animated-counter';
import { SkeletonModule } from 'primeng/skeleton';
import { TabViewModule } from 'primeng/tabview';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { MainRoutingModule } from './main-routing.module';
@NgModule({
  declarations: [],
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
    BadgeModule,
    AvatarModule,
    DropdownModule,
    InputNumberModule,
    MainRoutingModule
  ],
})
export class MainModule {}
