import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { ProjectDetailsModule } from './project-details/project-details.module';

import { MainMenuModule } from './main-menu-header/main-menu-header.module';
import { ViewModesModule } from './view-modes-header/view-modes-header.module';
import { AppComponent } from './app.component';


@NgModule({
  imports: [
    AppRoutingModule,
    ProjectDetailsModule,
    CommonModule,
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
