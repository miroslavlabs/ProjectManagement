import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { MainMenuModule } from './main-menu-header/main-menu-header.module';
import { ViewModesModule } from './view-modes-header/view-modes-header.module';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    MainMenuModule,
    ViewModesModule
  ],
  declarations: [],
  exports: [
    MainMenuModule,
    ViewModesModule
  ]

})
export class CoreModule {
}