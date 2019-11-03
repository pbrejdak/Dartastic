import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { AppShellComponent } from './app-shell/app-shell.component';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  declarations: [AppComponent, AppShellComponent],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, SharedModule, MatSidenavModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
