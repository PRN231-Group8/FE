import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RippleModule } from 'primeng/ripple';
import { AppMenuitemComponent } from './app.menuitem.component';
import { RouterModule } from '@angular/router';
import { AppConfigModule } from './config/config.module';
import { AppLayoutComponent } from './app.layout.component';
import { sharedModule } from './shared/shared.module';
import { AppSidebarComponent } from './app.sidebar.component';
import { AppMenuComponent } from './app.menu.component';
import { CommonModule } from '@angular/common';
import { AppFooterComponent } from './app.footer.component';
import { AppTopBarComponent } from './app.topbar.component';
import { ToastModule } from 'primeng/toast';

@NgModule({
    declarations: [
        AppMenuitemComponent,
        AppLayoutComponent,
        AppMenuComponent,
        AppSidebarComponent,
        AppFooterComponent,
        AppTopBarComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        InputTextModule,
        SidebarModule,
        BadgeModule,
        RadioButtonModule,
        InputSwitchModule,
        RippleModule,
        RouterModule,
        AppConfigModule,
        sharedModule,
        ToastModule
    ],
    exports: [AppLayoutComponent]
})
export class AppLayoutModule { }
