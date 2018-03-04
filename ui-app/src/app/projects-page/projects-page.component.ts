import { Component, Output, OnInit } from '@angular/core';
import { ProjectDataService } from '../services/ProjectData.service';
import { Project } from '../data-model/Project'

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
    projects: Project[];

    constructor(private projectDataService: ProjectDataService) {
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

    onClick(projectId: number) {
        this.selectedProjectId = projectId;
        $('project-details-form').css('display', 'block');
    }
}
