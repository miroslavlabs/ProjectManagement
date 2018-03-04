import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http';

import { MainMenuModule } from './main-menu-header/main-menu-header.module';
import { ViewModesModule } from './view-modes-header/view-modes-header.module';
import { AppComponent } from './app.component';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule, 
    MainMenuModule,
    ViewModesModule,
    HttpModule
  ],
  declarations: [ AppComponent ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
