import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ProjectDetailsModule } from './project-details-form/project-details-form.module';
import { ProjectComponent } from './projects-page.component';

@NgModule({
    imports: [ 
      BrowserModule,
      ProjectDetailsModule
    ],
    declarations: [ ProjectComponent ],
    providers: [],
    exports: [ ProjectComponent ]
  })
  export class ProjectsModule { }