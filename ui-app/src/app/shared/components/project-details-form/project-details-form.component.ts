import { Component, Input, Output, EventEmitter, OnChanges, OnInit, SimpleChanges, Inject, ViewChild, ElementRef } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

import { ProjectDataService } from '../../services/ProjectData.service';
import { trimValidator } from '../../validators/trimValidator';
import { Project } from '../../../data-model/Project';

import { CKEditorHelper } from '../../helpers/ckeditor-helper';
import { BaseFormField } from '../base-form/baseFormField';


@Component({
    selector: 'project-details-form',
    templateUrl: './project-details-form.component.html'
})
export class ProjectDetailsFormComponent implements OnChanges, OnInit {
    @Input() id: number;
    @Input() isFullscreen: boolean;
    @Input() configObj: Object = {};
    @Output() delete = new EventEmitter();
    @Output() formChange = new EventEmitter<any>();
    @Output() formAdd = new EventEmitter<any>();
    projectDetailsForm: FormGroup;
    enableReadOnly: boolean;
    hideButtons: boolean = true;

    @ViewChild('ckeditor') ckeditor: any;
    @ViewChild('addBtn') addBtn: ElementRef;
    editorConfig: {};

    projectFields: BaseFormField[] = [];
    ckEditorValue: any;

    project = new Project();
    private ckeditorHelper: CKEditorHelper; 

    constructor(
        private projectDataService: ProjectDataService,
        private router: Router) {     
    }

    ngOnInit() {
        this.prepareForm();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (typeof (this.id) == "undefined") {
            return;
        }
    }

    openProjectDetailsInFullscreen(event) {
        if((this.project.id || this.project.id == 0) && this.configObj['isEditAction'] == true) {
            this.router.navigate(['/projectDetails/edit', this.project.id]);
        } else {
            this.router.navigate(['/projectDetails/add']);
        }
    }

    prepareForm() {
        let projectDetailsObservable: Observable<Project> =
            this.projectDataService.getProject(this.id);

        this.projectFields = [];  
        let preparedObjectForField = new BaseFormField();
        preparedObjectForField.label = 'title';
        preparedObjectForField.validators = [Validators.required, trimValidator];
        preparedObjectForField.mandatory = true;

        if(this.id === undefined) {
            preparedObjectForField.value = '';
            this.projectFields.push(preparedObjectForField);
        } else {

            let projectDetailsSubscription: Subscription = projectDetailsObservable.subscribe({
                next: (projectData: Project) => { 
                    this.project = projectData[0];  
                    preparedObjectForField.value = projectData[0].title;
                    this.ckEditorValue = projectData[0].fullDescription;
                    this.projectFields.push(preparedObjectForField);
                },
                error: (error) => { console.log(error); }, // TODO - show error message in form
                complete: () => {
                    projectDetailsSubscription.unsubscribe();
                }
            });
        }
    }

    onSubmit(formObject) {
        this.project.title = formObject.form.value.title;
        this.project.fullDescription = formObject.ckeditorValue;

        let updatedProjectObservable: Observable<Project> =
            this.projectDataService.updateProject(this.id, this.project);

        let projectUpdateSubscription: Subscription = updatedProjectObservable.subscribe({
            next: (projectData: Project) => {
                this.formChange.emit(projectData);
            },
            error: (error) => { console.log(error); }, // TODO - show error message in form
            complete: () => {
                this.hideSubmitNCancelButtons();      
                projectUpdateSubscription.unsubscribe();
            }
        });
    }

    onDeleteClick(event) {
        let deleteProjectObservable: Observable<Project> =
        this.projectDataService.deleteProject(this.project.id);

        let projectDeleteSubscription: Subscription = deleteProjectObservable.subscribe({
            next: () => {
            },
            error: (error) => { console.log(error); }, // TODO - show error message in form
            complete: () => {
                projectDeleteSubscription.unsubscribe();
                this.delete.emit(this.project.id);
            }
        });
    }

    onCancel(event) {
        this.projectDetailsForm.controls.title.setValue(this.project.title);
        this.ckeditorHelper.setData(this.project.fullDescription);
        if(this.configObj['isEditAction'] == true) {
            this.hideSubmitNCancelButtons();
        } else {
            // this.formClosed.emit(null);
        }
    }

    close() {
        this.projectDetailsForm.controls.title.setValue('');
        this.ckeditorHelper.setData('');
    }

    onAddNewProject(formObject) {
        let newProject = new Project();

        newProject.title = formObject.form.value.title;
        //newProject.fullDescription = formObject.ckeditorValue;
    
        let createProjectObservable: Observable<Project> =
            this.projectDataService.createProject(newProject);

        let projectCreateSubscription: Subscription = createProjectObservable.subscribe({
            next: (projectData: Project) => {
                this.project = projectData;
                this.formAdd.emit(projectData);
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
        this.hideButtons = true;
        if(this.configObj['isAddAction'] != true) {
            this.enableReadOnly = true;
        }
    }

    showSubmitNCancelButtons() {
        this.hideButtons = false;
        if(this.configObj['isAddAction'] != true) {
           this.enableReadOnly = false;
        }
    }
}