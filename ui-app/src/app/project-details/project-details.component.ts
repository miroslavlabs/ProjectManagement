import { Component, Input, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { Location } from '@angular/common';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';

import { Project } from '../data-model/Project';
import { ProjectDataService } from '../shared';
import { trimValidator } from '../shared';

import * as $ from "jquery";
import * as CKEditorConf from '../custom-configs/ckeditor';

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
    @ViewChildren('tabcontent') tabcontents: QueryList<any>;
    @ViewChildren('tablinks') tablinks: QueryList<any>;

    fullscreen: boolean = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private location: Location) {
    }

    ngOnInit() {
        this.projectId = this.route.snapshot.params['id'];
        if(this.route.snapshot.routeConfig.path.indexOf('edit') != -1) {
            this.configObj['isEditAction'] = true;
        } else {
            this.configObj['isAddAction'] = true;
        }
    }

    goBack() {
        this.location.back();
    }

    onProjectChange(event) {
        this.projectChange.emit(event);
    }

    addNewProject(event) {
        this.projectAdd.emit(event);
    }

    onProjectDelete(event) {
        this.router.navigate(['/projects']);
    }

    openTabs(evt, tabName) {
        this.tabcontents.forEach( tabcontent => {
            tabcontent.nativeElement.style.display= "none";
        });
     
        this.tablinks.forEach( tablink => {
            tablink.nativeElement.className = tablink.nativeElement.className.replace(" active", "");
        });
        
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.className += " active";
    }
}