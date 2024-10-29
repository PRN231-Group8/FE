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
import { PhotoService } from './services/photo.service';
import { ProductService } from './services/product.service';
import { NotfoundComponent } from './core/components/notfound/notfound.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Third-party imports
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
import { fakeBackendProvider } from './_helper/fake-backend';
import { ButtonModule } from 'primeng/button';
import { GalleriaModule } from 'primeng/galleria';
import { AvatarModule } from 'primeng/avatar';
import { LoginComponent } from './core/components/login/login.component';
import { MapApiService } from './services/map-api.service';
import { VerifyEmailComponent } from './core/components/verify-email/verify-email.component';
import { SharingPostComponent } from './core/components/sharing-post/sharing-post.component';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { BadgeModule } from 'primeng/badge';

// Third-party imports

@NgModule({
  declarations: [
    AppComponent,
    NotfoundComponent,
    LoginComponent,
    VerifyEmailComponent,
    SharingPostComponent,
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
    fakeBackendProvider,
    CountryService,
    CustomerService,
    EventService,
    IconService,
    NodeService,
    PhotoService,
    ProductService,
    MapApiService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
