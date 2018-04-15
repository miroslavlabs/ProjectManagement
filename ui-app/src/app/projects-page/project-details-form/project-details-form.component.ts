import { Component, Input, Output, EventEmitter, OnChanges, OnInit, SimpleChanges, Inject, ViewChild, ElementRef } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';

import { ProjectDataService } from '../../services/ProjectData.service';
import { Project } from '../../data-model/Project';
import { trimValidator } from './trimValidator.directive';

import * as $ from "jquery";
import * as CKEditorConf from '../../ckeditor.js';

@Component({
    selector: 'project-details-form',
    templateUrl: './project-details-form.component.html',
    styleUrls: ['./project-details-form.component.scss']
})
export class ProjectDetailsComponent implements OnChanges, OnInit {
    @Input() projectId: number;
    @Output() projectChange = new EventEmitter<Project>();
    showMessage: boolean = false;
    projectDetailsForm: FormGroup;
    formEdit: boolean = true;

    @ViewChild('ckeditor')ckeditor: any;
    editorConfig: {};

    project = new Project();

    constructor(
        private projectDataService: ProjectDataService,
        private fb: FormBuilder) {  
        
            this.createForm();
    }

    ngOnInit() {
        this.editorConfig = CKEditorConf.conf;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (typeof (this.projectId) == "undefined") {
            return;
        }
        this.prepareForm();
    }

    prepareForm() {
        this.project = new Project();
        let projectDetailsObservable: Observable<Project> =
            this.projectDataService.getProject(this.projectId);

        let projectDetailsSubscription: Subscription = projectDetailsObservable.subscribe({
            next: (projectData: Project) => this.project = projectData,
            error: (error) => { console.log(error); }, // TODO - show error message in form
            complete: () => {
                // Update editor.
                this.ckeditor.instance.setData(this.project.fullDescription);

                projectDetailsSubscription.unsubscribe();
                this.createForm();
            }
        })
    }

    createForm() {
        this.projectDetailsForm = this.fb.group({
            title: ['', trimValidator]
        });
    }

    onSubmit(form: NgForm) {
        this.project.fullDescription = this.ckeditor.instance.getData();

        let updatedProjectObservable: Observable<Project> =
            this.projectDataService.updateProject(this.projectId, this.project);

        let projectUpdateSubscription: Subscription = updatedProjectObservable.subscribe({
            next: (projectData: Project) => {
                this.projectChange.emit(projectData);
            },
            error: (error) => { console.log(error); }, // TODO - show error message in form
            complete: () => {
                this.showMessage = true;
                this.hideSubmitNCancelButtons();
                setTimeout(function(){
                    this.showMessage = false;
                }, 1000);
                projectUpdateSubscription.unsubscribe();
            }
        });
    }

    closePopUp() {
        $('project-details-form').css('display', 'none');
    }

    hideSubmitNCancelButtons() {
        $('.fa-edit').css('opacity','1');
        $('#btns_actions_container-fixed ').css('display','none');
        $('#project-title').removeClass('input-border');
        this.prepareForm();
        this.formEdit = true;
    }

    showSubmitNCancelButtons() {
        $('.fa-edit').css('opacity','0.3');
        $('#btns_actions_container-fixed').css('display','inline-block');
        $('#project-title').addClass('input-border');
        this.formEdit = false;
    }
} 