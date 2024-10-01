import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { HomeModule } from '../layout/home.module';
import { BrowserModule } from '@angular/platform-browser';
import { PreviewAppComponent } from './preview-app/preview-app.component';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [MainComponent, PreviewAppComponent],
    imports: [
    CommonModule,
    MainRoutingModule,
    ImageModule,
    BrowserModule,
    HomeModule,
    ButtonModule,
    RatingModule,
    FormsModule,
]
})
export class MainModule { }