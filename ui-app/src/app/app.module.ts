import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { ProjectComponent } from './projects-page/projects-page.component';
import { MenuComponent } from './main-menu-header/main-menu-header.component';
import { ViewModesComponent } from './view-modes-header/view-modes-header.component';


@NgModule({
  declarations: [
    ProjectComponent,
    MenuComponent,
    ViewModesComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [ProjectComponent, MenuComponent, ViewModesComponent]
})
export class AppModule { }
