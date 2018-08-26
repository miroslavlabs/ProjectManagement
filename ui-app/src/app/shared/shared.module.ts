import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from 'ng2-ckeditor';

import { ProjectDetailsFormComponent } from './components/project-details-form/project-details-form.component';
import { ProjectDataService } from './services/ProjectData.service';
import { BoardDataService } from './services/BoardsData.service';
import { StoryDataService } from './services/StoryData.service';
import { BaseFormComponent } from './components/base-form/base-form.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        CKEditorModule
    ],
    declarations: [
        ProjectDetailsFormComponent,
        BaseFormComponent
    ],
    exports: [
        ProjectDetailsFormComponent,
        BaseFormComponent
    ],
    providers: [
        ProjectDataService,
        BoardDataService,
        StoryDataService
    ]
})
export class SharedModule { }