import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ProjectDataService } from '../../services/ProjectData.service';
import { Project } from '../../data-model/Project'

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';

import * as $ from "jquery";

@Component({
    selector: 'project-details-form',
    templateUrl: './project-details-form.component.html',
    styleUrls: ['./project-details-form.component.scss']
})
export class ProjectDetailsComponent implements OnChanges {
    @Input() projectId: number;
    @Output() projectChange = new EventEmitter<Project>();
    project = new Project();

    constructor(private projectDataService: ProjectDataService) {
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log(`The selected id is ${this.projectId}`)
        if (typeof (this.projectId) == "undefined") {
            return;
        }

        let projectDetailsObservable: Observable<Project> =
            this.projectDataService.getProject(this.projectId);

        let projectDetailsSubscription: Subscription = projectDetailsObservable.subscribe({
            next: (projectData: Project) => this.project = projectData,
            error: (error) => { console.log(error); }, // TODO - show error message in form
            complete: () => {
                projectDetailsSubscription.unsubscribe();
            }
        })
    }

    onSubmit(form: NgForm) {
        let updatedProjectObservable: Observable<Project> =
            this.projectDataService.updateProject(this.project);

        let projectUpdateSubscription: Subscription = updatedProjectObservable.subscribe({
            next: (projectData: Project) => this.projectChange.emit(projectData),
            error: (error) => { console.log(error); }, // TODO - show error message in form
            complete: () => {
                $('.project-details-form').css('display', 'none');
                projectUpdateSubscription.unsubscribe();
            }
        });
    }

    closePopUp() {
        $('project-details-form').css('display', 'none');
    }
} 