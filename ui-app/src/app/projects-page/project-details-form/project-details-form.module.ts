import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from 'ng2-ckeditor';

import { ProjectDetailsComponent } from './project-details-form.component';

@NgModule({
    imports: [
        FormsModule,
        BrowserModule,
        ReactiveFormsModule,
        CKEditorModule
    ],
    declarations: [ProjectDetailsComponent],
    providers: [ ],
    exports: [ProjectDetailsComponent]
})
export class ProjectDetailsModule { }