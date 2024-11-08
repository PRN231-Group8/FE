import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {
  CommonModule,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import { CountryService } from './services/country.service';
import { CustomerService } from './services/customer.service';
import { EventService } from './services/event.service';
import { IconService } from './services/icon.service';
import { NodeService } from './services/node.service';
import { ProductService } from './services/product.service';
import { NotfoundComponent } from './core/components/notfound/notfound.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  GoogleLoginProvider,
  GoogleSigninButtonModule,
  SocialAuthServiceConfig,
  SocialLoginModule,
} from '@abacritt/angularx-social-login';
import { environment } from '../environments/environment';
import { JwtInterceptor } from './_helper/jwt.interceptor';
import { ErrorInterceptor } from './_helper/error.interceptor';
import { AuthenticationService } from './services/authentication.service';
import { FakeBackendInterceptor } from './_helper/fake-backend';
import { ButtonModule } from 'primeng/button';
import { GalleriaModule } from 'primeng/galleria';
import { AvatarModule } from 'primeng/avatar';
import { LoginComponent } from './core/components/login/login.component';
import { MapApiService } from './services/map-api.service';
import { VerifyEmailComponent } from './core/components/verify-email/verify-email.component';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { BadgeModule } from 'primeng/badge';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { TabMenuModule } from 'primeng/tabmenu';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ScrollTopModule } from 'primeng/scrolltop';
import { CarouselModule } from 'primeng/carousel';
import { ContextMenuModule } from 'primeng/contextmenu';
import { FloatLabelModule } from 'primeng/floatlabel';
import { sharedModule } from './layout/shared/shared.module';
import { VnpayFormModule } from './core/components/home/vnpay-form/vnpay-form.module';

@NgModule({
  declarations: [
    AppComponent,
    NotfoundComponent,
    LoginComponent,
    VerifyEmailComponent,
  ],
  imports: [
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BrowserModule,
    MenuModule,
    ToastModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserModule,
    HttpClientModule,
    SocialLoginModule,
    GoogleSigninButtonModule,
    AppLayoutModule,
    ButtonModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    GoogleSigninButtonModule,
    GalleriaModule,
    AvatarModule,
    DialogModule,
    FileUploadModule,
    BadgeModule,
    InputTextareaModule,
    InputTextModule,
    MenuModule,
    DropdownModule,
    CalendarModule,
    FloatLabelModule,
    PanelMenuModule,
    ScrollTopModule,
    CarouselModule,
    ContextMenuModule,
    TabMenuModule,
    sharedModule,
    FileUploadModule,
    VnpayFormModule,
  ],
  exports: [
    SocialLoginModule,
    GoogleSigninButtonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ToastModule,
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
    MessageService,
    AuthenticationService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FakeBackendInterceptor,
      multi: true,
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.GOOGLE_CLIENT_ID, {}),
          },
        ],
        onError: err => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
    CountryService,
    CustomerService,
    EventService,
    IconService,
    NodeService,
    ConfirmationService,
    ProductService,
    MapApiService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
