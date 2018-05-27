import { Component, Input, Output, EventEmitter, OnChanges, OnInit, SimpleChanges, Inject, ViewChild, ElementRef } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

import { ProjectDataService } from '../../services/ProjectData.service';
import { trimValidator } from '../../validators/trimValidator';
import { Project } from '../../../data-model/Project';

import * as $ from "jquery";
import * as CKEditorConf from '../../../custom-configs/ckeditor.js';

@Component({
    selector: 'project-details-dialog',
    templateUrl: './project-details-dialog.component.html',
    styleUrls: ['./project-details-dialog.component.scss']
})
export class ProjectDetailsDialogComponent {
    @Input() projectId: number;
    @Input() configObj: Object = {};
    @Output() projectChange = new EventEmitter<Project>();
    @Output() projectAdd = new EventEmitter<Project>();
    @Output() formClosed = new EventEmitter();

    constructor() { }

    onProjectChange(event) {
        this.projectChange.emit(event);
    }

    addNewProject(event) {
        this.projectAdd.emit(event);
    }

    closePopUp(event) {
        this.formClosed.emit(null);
    }
}