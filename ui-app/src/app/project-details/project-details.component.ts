import { Component, Input, Output, EventEmitter, OnChanges, OnInit, SimpleChanges, Inject, ViewChild, ElementRef } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';

import { Project } from './../data-model/Project';
import { ProjectDataService } from '../shared';
import { trimValidator } from '../shared';

import * as $ from "jquery";
import * as CKEditorConf from './../custom-configs/ckeditor.js';

@Component({
    selector: 'project-details',
    templateUrl: './project-details.component.html',
    styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent {
    @Input() projectId: number;
    @Input() configObj: Object = {};
    @Output() projectChange = new EventEmitter<Project>();
    @Output() projectAdd = new EventEmitter<Project>();

    fullscreen: boolean = true;

    constructor(
        private route: ActivatedRoute ) {
    }

    ngOnInit() {
        this.projectId = this.route.snapshot.params['id'];
        if(this.route.snapshot.routeConfig.path.indexOf('edit') != -1) {
            this.configObj['isEditAction'] = true;
        } else {
            this.configObj['isAddAction'] = true;
        }
        console.log(this.configObj);
    }

    onProjectChange(event) {
        this.projectChange.emit(event);
    }

    addNewProject(event) {
        this.projectAdd.emit(event);
    }

    openTabs(evt, tabName) {
        // Declare all variables
        var i, tabcontent, tablinks;
    
        // Get all elements with class="tabcontent" and hide them
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
    
        // Get all elements with class="tablinks" and remove the class "active"
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
    
        // Show the current tab, and add an "active" class to the button that opened the tab
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.className += " active";
    }
}