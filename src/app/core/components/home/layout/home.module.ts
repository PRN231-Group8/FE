import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home.component';
import { MainComponent } from '../main/main.component';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    MainComponent,
  ],
  imports: [
    CommonModule,
    MenuModule,
    ButtonModule,
    MenubarModule,
  ],
})
export class HomeModule {}
