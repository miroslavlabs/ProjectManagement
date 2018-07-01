import { Component, Output, OnInit, Input} from '@angular/core';
import { ProjectDataService } from '../shared/';
import { Project } from '../data-model/Project';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';

import * as $ from "jquery";

@Component({
    selector: 'projects',
    templateUrl: './projects-page.component.html',
    styleUrls: ['./projects-page.component.scss']
})
export class ProjectComponent implements OnInit {
    @Output() selectedProjectId: number;
    @Output() updateProject: Object;
    projects: Project[];
    isSelected: boolean = false;
    visible: boolean = false;

    constructor(
        private projectDataService: ProjectDataService,
        private router: Router) {

        this.updateProject = {
            isEditAction: true,
            isAddAction: false
        }
    }

    ngOnInit() {
        let projectsObservable: Observable<Project[]> =
            this.projectDataService.getProjects();

        let projectsSubscription = projectsObservable.subscribe({
            next: (projects: Project[]) => this.projects = projects,
            error: (error) => { console.log(error) }, // TODO show error message
            complete: () => {
                projectsSubscription.unsubscribe();
            }
        });
    }

    onProjectChange(changedProject) {
        for (let i =0; i < this.projects.length; i++) {
            if (this.projects[i].id == changedProject.id) {
                this.projects[i] = changedProject;
                break;
            }
        }
    }

    onAddProject(projectData) {
        this.projects.push(projectData);
    }

    onCloseForm(event) {
        this.visible = false;
        location.reload();
    }

    onDeleteClick(projectId: number) {
        let deleteProjectObservable: Observable<Project> =
        this.projectDataService.deleteProject(projectId);

        let projectDeleteSubscription: Subscription = deleteProjectObservable.subscribe({
            next: () => {
            },
            error: (error) => { console.log(error); }, // TODO - show error message in form
            complete: () => {    
                projectDeleteSubscription.unsubscribe();
                location.reload();
            }
        });
    }

    onClick(projectId: number) {
        this.selectedProjectId = projectId;
        this.visible = true;
    }
}
