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
    selector: 'project-details-form',
    templateUrl: './project-details-form.component.html',
    styleUrls: ['./project-details-form.component.scss']
})
export class ProjectDetailsFormComponent implements OnChanges, OnInit {
    @Input() projectId: number;
    @Input() isFullscreen: boolean;
    @Input() configObj: Object = {};
    @Output() onFormClosed = new EventEmitter();
    @Output() projectFormChange = new EventEmitter<Project>();
    @Output() projectFormAdd = new EventEmitter<Project>();
    projectDetailsForm: FormGroup;
    enableReadOnly: boolean;

    @ViewChild('ckeditor') ckeditor: any;
    editorConfig: {};

    project = new Project();    

    constructor(
        private projectDataService: ProjectDataService,
        private router: Router,
        fb: FormBuilder) {

        this.projectDetailsForm = fb.group({
            title: ['', trimValidator]
        });
    }

    ngOnInit() {
        if(this.configObj['isAddAction'] == true || this.configObj['isEditAction'] == false) {
            this.showSubmitNCancelButtons();
            CKEditorConf.conf.readOnly = false;
        } else {
            this.enableReadOnly = true;
        }
        this.editorConfig = CKEditorConf.conf;
    }

    ngAfterViewInit() {
        if(this.configObj['isAddAction'] == true) {
            $('#addBtn').attr('disabled','disabled');
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (typeof (this.projectId) == "undefined") {
            return;
        }

        this.prepareForm();
    }

    openProjectDetailsInFullscreen() {
        if((this.project.id || this.project.id == 0) && this.configObj['isEditAction'] == true) {
            this.router.navigate(['/projectDetails/edit', this.project.id]);
        } else {
            this.onFormClosed.emit();
            this.router.navigate(['/projectDetails/add']);
        }
    }

    prepareForm() {
        let projectDetailsObservable: Observable<Project> =
            this.projectDataService.getProject(this.projectId);

        let projectDetailsSubscription: Subscription = projectDetailsObservable.subscribe({
            next: (projectData: Project) => {
                this.project = projectData[0];
                // Update editor.
                this.ckeditor.value = projectData[0].fullDescription;
            },
            error: (error) => { console.log(error); }, // TODO - show error message in form
            complete: () => {
                projectDetailsSubscription.unsubscribe();
            }
        })
    }

    onSubmit(form: NgForm) {
        this.project.title = form.value.title;
        this.project.fullDescription = this.ckeditor.instance.getData();

        let updatedProjectObservable: Observable<Project> =
            this.projectDataService.updateProject(this.projectId, this.project);

        let projectUpdateSubscription: Subscription = updatedProjectObservable.subscribe({
            next: (projectData: Project) => {
                this.projectFormChange.emit(projectData);
            },
            error: (error) => { console.log(error); }, // TODO - show error message in form
            complete: () => {
                this.hideSubmitNCancelButtons();      
                projectUpdateSubscription.unsubscribe();
            }
        });
    }

    onCancel() {
        this.projectDetailsForm.controls.title.setValue(this.project.title);
        this.ckeditor.instance.setData(this.project.fullDescription);
        if(this.configObj['isEditAction'] == true) {
            this.hideSubmitNCancelButtons();
        } else {
            // this.formClosed.emit(null);
        }
    }

    enableAddButton() {
        if(this.configObj['isAddAction'] == true) {
            if(this.projectDetailsForm.controls.title.value != "" ) {
                $('#addBtn').removeAttr('disabled');
            }
        }
    }

    close() {
        this.projectDetailsForm.controls.title.setValue('');
        this.ckeditor.instance.setData('');
    }

    onAddNewProject(form: NgForm) {
        let newProject = new Project();

        newProject.title = form.controls.title.value;
        newProject.fullDescription = this.ckeditor.instance.getData();

        let createProjectObservable: Observable<Project> =
            this.projectDataService.createProject(newProject);

        let projectCreateSubscription: Subscription = createProjectObservable.subscribe({
            next: (projectData: Project) => {
                this.project = projectData;
                this.projectFormAdd.emit(projectData);
            },
            error: (error) => { console.log(error); }, // TODO - show error message in form
            complete: () => {
                location.reload();
                projectCreateSubscription.unsubscribe();
                // this.formClosed.emit(null);
            }
        });
    }

    hideSubmitNCancelButtons() {
        $('.fa-edit').css('opacity', '1');
        $('#btns_actions_container-fixed ').css('display', 'none');
        if(this.configObj['isAddAction'] != true) {
            this.enableReadOnly = true;
        }
    }

    showSubmitNCancelButtons() {
        $('.fa-edit').css('opacity', '0.3');
        $('#btns_actions_container-fixed').css('display', 'inline-block');
        if(this.configObj['isAddAction'] != true) {
           this.enableReadOnly = false;
        }
    }
}