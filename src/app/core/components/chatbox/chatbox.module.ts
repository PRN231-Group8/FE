import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatboxComponent } from './chatbox.component';
import { ToastModule } from 'primeng/toast';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatboxRoutingModule } from './chatbox-routing.module';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ImageModule } from 'primeng/image';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { ImageViewerComponent } from '../image-view/image-view.component';
import { MessageService } from 'primeng/api';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { AvatarModule } from 'primeng/avatar';
import { TabMenuModule } from 'primeng/tabmenu';
import { FileUploadModule } from 'primeng/fileupload';

@NgModule({
  declarations: [ChatboxComponent, ImageViewerComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChatboxRoutingModule,
    ToastModule,
    CardModule,
    BadgeModule,
    ButtonModule,
    MessageModule,
    InputTextareaModule,
    ImageModule,
    DialogModule,
    DynamicDialogModule,
    ScrollPanelModule,
    OverlayPanelModule,
    TabViewModule,
    TagModule,
    AvatarModule,
    TabMenuModule,
    FileUploadModule
  ],
  exports: [ChatboxComponent],
  providers: [DialogService, MessageService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChatboxModule {}
