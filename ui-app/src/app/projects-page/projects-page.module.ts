import { NgModule } from '@angular/core';
//import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { ProjectComponent } from './projects-page.component';
import { SharedModule } from '../shared';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from 'ng2-ckeditor';

import { HttpClient } from '@angular/common/http';
import { ProjectDataService } from '../shared';
import { ProjectsPageRoutingModule } from './projects-page-routing.module';
import { BoardsModule } from '../board-view/board-view.module';

@NgModule({
    imports: [
        BoardsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ProjectsPageRoutingModule,
        CKEditorModule,
        HttpClientModule,
        SharedModule
    ],
    declarations: [
        ProjectComponent
    ],
    providers: [ProjectDataService, HttpClient],
    exports: [ProjectComponent]
})
export class ProjectsModule { }