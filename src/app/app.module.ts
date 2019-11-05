import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { AppShellComponent } from './app-shell/app-shell.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { LandingComponent } from './landing/landing.component';

@NgModule({
  declarations: [AppComponent, AppShellComponent, LandingComponent],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, SharedModule, MatSidenavModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
