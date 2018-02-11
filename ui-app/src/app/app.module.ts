import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';


import { MainMenuModule } from './main-menu-header/main-menu-header.module';
import { ViewModesModule } from './view-modes-header/view-modes-header.module';
import { AppComponent } from './app.component';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule, 
    MainMenuModule,
    ViewModesModule
  ],
  declarations: [ AppComponent ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
