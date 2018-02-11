import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ProjectsModule } from '../projects-page/projects-page.module';
import { MenuComponent } from './main-menu-header.component';

@NgModule({
    imports: [ 
      BrowserModule,
      ProjectsModule
    ],
    declarations: [ MenuComponent ],
    providers: [],
    exports: [ MenuComponent ]
  })
  export class MainMenuModule { }