import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-menu-header-routing.module';

import { ProjectsModule } from '../projects-page/projects-page.module';
import { MenuComponent } from './main-menu-header.component';

@NgModule({
    imports: [
      CommonModule,
      ProjectsModule,
      MainRoutingModule
    ],
    declarations: [ MenuComponent ],
    providers: [],
    exports: [ MenuComponent ]
  })
  export class MainMenuModule { }