import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from 'ng2-ckeditor';

import { ProjectDetailsDialogComponent } from './components/project-details-dialog/project-details-dialog.component';
import { ProjectDetailsFormComponent } from './components/project-details-form/project-details-form.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        CKEditorModule
    ],
    declarations: [
        ProjectDetailsDialogComponent,
        ProjectDetailsFormComponent
    ],
    exports: [
        ProjectDetailsDialogComponent,
        ProjectDetailsFormComponent
    ]
})
export class SharedModule { }