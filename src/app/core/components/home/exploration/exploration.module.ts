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
import { ExplorationComponent } from './exploration.component';
import { TagModule } from 'primeng/tag';
import { DataViewModule } from 'primeng/dataview';
import { ProductService } from '../../../../services/product.service';
import { SkeletonModule } from 'primeng/skeleton';
import { ExplorationRoutingModule } from './exploration-routing.module';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { FullCalendarModule } from '@fullcalendar/angular';

@NgModule({
  declarations: [ExplorationComponent],
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
    TabViewModule,
    RatingModule,
    sharedModule,
    TagModule,
    DataViewModule,
    SkeletonModule,
    ExplorationRoutingModule,
    InputMaskModule,
    InputNumberModule,
    FullCalendarModule,
  ],
  exports: [ExplorationComponent],
  providers: [ProductService],
})
export class ExplorationModule {}
