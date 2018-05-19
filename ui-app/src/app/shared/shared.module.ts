import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from 'ng2-ckeditor';

import { ProjectDetailsComponent } from './components/project-details-form/project-details-form.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        CKEditorModule
    ],
    declarations: [
        ProjectDetailsComponent
    ],
    exports: [ProjectDetailsComponent]
})
export class SharedModule { }