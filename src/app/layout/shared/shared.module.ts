import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
<<<<<<< HEAD:src/app/layout/shared/shared.module.ts
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
  ],
=======
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';

@NgModule({
  declarations: [HomeComponent, FooterComponent],
>>>>>>> 351a901e1a17435f848ed083cdafe2911c75c69c:src/app/core/components/home/layout/home.module.ts
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
<<<<<<< HEAD:src/app/layout/shared/shared.module.ts
    CommonModule,
=======
    NavbarComponent,
    MenuModule,
    BrowserModule,
    AvatarModule,
    MenuModule,
    AvatarModule,
    ButtonModule,
    RippleModule,
    RouterModule,
>>>>>>> 351a901e1a17435f848ed083cdafe2911c75c69c:src/app/core/components/home/layout/home.module.ts
  ],
  exports: [FooterComponent, NavbarComponent],
})
export class sharedModule {}
