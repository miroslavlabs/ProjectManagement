import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ProjectDetailsModule } from './project-details-form/project-details-form.module';

import { ProjectComponent } from './projects-page.component';

import { HttpClient } from '@angular/common/http';
import { ProjectDataService } from '../services/ProjectData.service';

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        ProjectDetailsModule
    ],
    declarations: [ProjectComponent],
    providers: [ProjectDataService, HttpClient],
    exports: [ProjectComponent]
})
export class ProjectsModule { }