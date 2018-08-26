import { Component, EventEmitter, Output, ViewChild, Input } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';

import { trimValidator } from '../../shared/validators/trimValidator';
import { Story } from '../../data-model/Story';
import { StoryDataService } from '../../shared/services/StoryData.service';
import { CKEditorHelper } from '../../shared/helpers/ckeditor-helper';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BaseFormField } from '../../shared/components/base-form/baseFormField';

@Component({
    selector: 'board-createstory-dialog',
    templateUrl: './boards-create-story.component.html',
    styleUrls: ['./boards-create-story.component.scss']
})
export class BoardCreateStoryDialogComponent {   
    @Output() dialogClosed = new EventEmitter();
    @Input() boardColumns;
    @ViewChild('ckeditor') ckeditor: any;
    @Output() addedStory = new EventEmitter();

    editorConfig: {};
    configObj: Object = {};
    columnId: number;
    story: Story = new Story;
    storyFields: BaseFormField[];
    dropdownValues: string[] = ['Major', 'High', 'Minor'];

    private ckeditorHelper: CKEditorHelper; 

    constructor(private storyDataService: StoryDataService) {
        this.configObj = {
            isEditAction: false,
            isAddAction: true
        }
    }

    ngOnInit() {
        this.prepareFormFields();
    }

    prepareFormFields() {
        this.storyFields = [];
        this.story.title = '';
        this.story.actualTime = 0;
        this.story.estimatedTime = 0;
        this.story.remainingTime = 0;
        this.story.priority = '';
        
        let properties = Object.keys(this.story);
        for(let property of properties) {
            let transformedObject = new BaseFormField();
            transformedObject.label = property;
            transformedObject.value = '';
            if(property.indexOf('Time') !== -1 || property === 'priority') {
                transformedObject.canUseHalfSpace = true;
            }
            if(property === 'priority' || property === 'title') {
                if(property === 'priority') {
                    //ToDo: make type and constants
                    transformedObject.typeOfField = 'dropdown';
                    transformedObject.values = this.dropdownValues;
                }
                transformedObject.mandatory = true;
                transformedObject.validators = [Validators.required, trimValidator];
            }
            this.storyFields.push(transformedObject);
        }
    }

    onColumnSelectionChange(event) {
        let selectedColumnName = event.srcElement.value;
        for(let column of this.boardColumns) {
            if(column.name == selectedColumnName) {
                this.columnId = column.id;
            }
        }
    }

    onAddStory(form: NgForm) {
        this.story.title = form.value.title;
        this.story.description = this.ckeditorHelper.getData();
        this.story.actualTime = form.value.actualTime;
        this.story.estimatedTime = form.value.estimatedTime;
        this.story.priority = form.value.priority;
        this.story.remainingTime = form.value.remainingTime;

        let createStoryObservable: Observable<Story> =
            this.storyDataService.createStory(this.story, this.columnId);

        let storyCreateSubscription: Subscription = createStoryObservable.subscribe({
            next: () => {
                this.addedStory.emit(this.story);
            },
            error: (error) => { console.log(error); }, // TODO - show error message in form
            complete: () => {
                storyCreateSubscription.unsubscribe();
                this.closePopUp();
            }
        });
    }

    closePopUp(event?) {
        this.dialogClosed.emit(null);
    }
}