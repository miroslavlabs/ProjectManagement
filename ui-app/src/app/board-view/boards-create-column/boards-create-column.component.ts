import { Component, EventEmitter, Output, Input } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { trimValidator } from '../../shared/validators/trimValidator';
import { State } from '../../data-model/State';
import { Observable } from 'rxjs/Observable';
import { BoardDataService } from '../../shared/services/BoardsData.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'board-createcolumn-dialog',
    templateUrl: './boards-create-column.component.html',
    styleUrls: ['./boards-create-column.component.scss']
})
export class BoardCreateColumnDialogComponent {
    columnCreationForm: FormGroup;
    column: State = new State();
    disableColumnNameSelection: boolean = true;
    @Output() formClosed = new EventEmitter();
    @Output() addedColumn = new EventEmitter();
    @Input() boardId;

    constructor(fb: FormBuilder,
        private boardDataService: BoardDataService) {
        this.columnCreationForm = fb.group({
            title: ['', trimValidator]
        });
    }

    onAddColumn(form: NgForm) {
        this.column.name = form.value.title;

        let createColumnObservable: Observable<State> =
            this.boardDataService.createColumn(this.column, this.boardId);

        let columnCreateSubscription: Subscription = createColumnObservable.subscribe({
            next: () => {
                this.addedColumn.emit(this.column);
            },
            error: (error) => { console.log(error); }, // TODO - show error message in form
            complete: () => {
                columnCreateSubscription.unsubscribe();
                this.closePopUp();
            }
        });
    }

    onOptionSelected(event) {
        if(event.srcElement.id === "after") {
            if(event.srcElement.checked == true) {
                this.disableColumnNameSelection = false;
            }
        } else {
            this.disableColumnNameSelection = true;
        }
    }

    closePopUp(event?) {
        this.formClosed.emit(null);
    }
}