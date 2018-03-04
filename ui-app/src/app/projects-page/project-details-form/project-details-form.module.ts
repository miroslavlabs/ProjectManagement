import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { ProjectDetailsComponent } from './project-details-form.component';

@NgModule({
    imports: [
        FormsModule,
        BrowserModule],
    declarations: [ProjectDetailsComponent],
    providers: [ ],
    exports: [ProjectDetailsComponent]
})
export class ProjectDetailsModule { }