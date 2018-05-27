import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from 'ng2-ckeditor';
import { SharedModule } from '../shared';

import { ProjectDetailsComponent } from './project-details.component';
import { ProjectDetailsRoutingModule } from './project-details-routing.module';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        CKEditorModule,
        SharedModule,
        ProjectDetailsRoutingModule
    ],
    declarations: [
        ProjectDetailsComponent
    ],
    exports: [ProjectDetailsComponent]
})
export class ProjectDetailsModule { }