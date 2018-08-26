import { Component, Input, ElementRef, ViewChild, OnInit, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray, NgForm } from '../../../../../node_modules/@angular/forms';

import { BaseFormField } from './baseFormField';
import { CKEditorHelper } from '../../helpers/ckeditor-helper';

@Component({
    selector: 'base-form',
    templateUrl: './base-form.component.html',
    styleUrls: ['./base-form.component.scss']
})
export class BaseFormComponent implements OnInit {
    baseForm: FormGroup;

    @Input() fields: BaseFormField[];

    @Input() addCKEditor: boolean;

    @Input() configObj: Object = {};

    @Input() enableReadOnly: boolean;

    @Input() ckEditorValue;

    @Input() withToolsBar: boolean = true;

    @Output() openInFullScreen = new EventEmitter<any>();
    @Output() onSubmitForm = new EventEmitter<any>();
    @Output() onAddnew = new EventEmitter<any>();
    @Output() onDelete = new EventEmitter<any>();
    @Output() onCancelForm = new EventEmitter<any>();
    @Output() onRefresh = new EventEmitter<any>();

    hideButtons: boolean = true;
    canUseHalfRow: boolean = false;
    canUseWholeRow: boolean = false;

    @ViewChild('ckeditor') ckeditor: any;
    @ViewChild('addBtn') addBtn: ElementRef;
    editorConfig: {};

    private ckeditorHelper: CKEditorHelper; 

    constructor(public fb: FormBuilder) {
        this.baseForm = fb.group({
        });
    }

    ngOnInit() {
        if(this.addCKEditor) {
            this.ckeditorHelper = new CKEditorHelper(this.ckeditor);
            if(this.configObj && (this.configObj['isAddAction'] == true || this.configObj['isEditAction'] == false)) {
                this.showSubmitNCancelButtons();
                this.ckeditorHelper.setReadOnly(false);
            } else {
                this.enableReadOnly = true;
            }
            this.editorConfig = this.ckeditorHelper.getConfig();
        }
    }


    ngOnChanges(changes: SimpleChanges) {
        if(this.fields.length === 0) {
            return;
        } else {
            this.addItem();
            if(this.ckEditorValue) {
               // this.ckeditorHelper.setValue(this.ckEditorValue);
            }
        }
    }

    addItem(): void {
        for( let field of this.fields) {     
           this.baseForm.addControl(field.label, new FormControl( field.value, field.validators));
        }
    }

    openInFullscreen() {
        this.openInFullScreen.emit();
    }

    onSubmit(form: NgForm) {
        let formObject = {
            //ckeditorValue: this.ckeditorHelper.getData(),
            form: form
        }
      this.onSubmitForm.emit(formObject);
    }

    refresh() {
        this.onRefresh.emit();
    }

    onDeleteClick() {
        this.onDelete.emit(); 
    }

    onCancel() {
        this.onCancelForm.emit();
    }


    onAddNew(form: NgForm) {
        let formObject = {
           // ckeditorValue: this.ckeditorHelper.getData(),
            form: form
        }
        this.onAddnew.emit(formObject);
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