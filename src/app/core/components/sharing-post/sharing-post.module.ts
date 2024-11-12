import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ScrollTopModule } from 'primeng/scrolltop';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { SharingPostComponent } from './sharing-post.component';
import { SharingPostRoutingModule } from './sharing-post-routing';
import { sharedModule } from '../../../layout/shared/shared.module';
import { GalleriaModule } from 'primeng/galleria';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { RelativeTimePipe } from './relative-time.pipe';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelModule } from 'primeng/panel';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
@NgModule({
  declarations: [SharingPostComponent, RelativeTimePipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    CalendarModule,
    FileUploadModule,
    ToastModule,
    ScrollTopModule,
    ProgressSpinnerModule,
    AvatarModule,
    BadgeModule,
    DialogModule,
    ProgressBarModule,
    SharingPostRoutingModule,
    sharedModule,
    GalleriaModule,
    MenuModule,
    TableModule,
    InputTextareaModule,
    CheckboxModule,
    ConfirmDialogModule,
    InfiniteScrollModule,
    ToolbarModule,
    PanelModule,
    ScrollPanelModule,
    SkeletonModule,
    TooltipModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService, MessageService],
})
export class SharingPostModule {}
