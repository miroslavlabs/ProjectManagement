import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ProjectDetailsComponent } from './project-details-form.component';

@NgModule({
    imports: [ BrowserModule ],
    declarations: [ ProjectDetailsComponent ],
    providers: [],
    exports: [ ProjectDetailsComponent ]
  })
  export class ProjectDetailsModule { }