import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { ScrollTopModule } from 'primeng/scrolltop';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { ChatboxComponent } from '../../core/components/chatbox/chatbox.component';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ImageViewerComponent } from '../../core/components/image-view/image-view.component';

@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
    ChatboxComponent,
    ImageViewerComponent,
  ],
  imports: [
    BrowserModule,
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
    MenuModule,
    AvatarModule,
    RouterModule,
    ReactiveFormsModule,
    ToastModule,
    CardModule,
    InputTextareaModule,
    ImageModule,
    DialogModule,
    DynamicDialogModule,
    ScrollPanelModule,
    OverlayPanelModule,
    TabViewModule,
    TagModule,
    TabMenuModule,
    FileUploadModule,
    ProgressSpinnerModule,
    DividerModule,
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    ChatboxComponent,
    ImageViewerComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class sharedModule {}