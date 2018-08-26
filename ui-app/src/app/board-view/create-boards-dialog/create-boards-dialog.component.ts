import { Component, EventEmitter, Output, ViewChild, Input } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { trimValidator } from '../../shared/validators/trimValidator';
import { BoardDataService } from '../../shared/services/BoardsData.service';
import { Board } from '../../data-model/Board';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'create-boards-dialog',
    templateUrl: './create-boards-dialog.component.html',
    styleUrls: ['./create-boards-dialog.component.scss']
})
export class CreateBoardDialogComponent {
    boardCreationForm: FormGroup;
    board: Board = new Board();
    @Input() projectId;
    @Output() dialogClosed = new EventEmitter();
    @Output() addedBoard = new EventEmitter();

    constructor(
        fb: FormBuilder,
        private BoardDataService: BoardDataService
    ) {
        this.boardCreationForm = fb.group({
            title: ['', trimValidator]
        });
    }

    onAddBoard(form: NgForm) {
        this.board.name = form.value.title;

        let createBoardObservable: Observable<Board> =
            this.BoardDataService.createBoard(this.board, this.projectId);

        let boardCreateSubscription: Subscription = createBoardObservable.subscribe({
            next: () => {
                this.addedBoard.emit(this.board);
            },
            error: (error) => { console.log(error); }, // TODO - show error message in form
            complete: () => {
                boardCreateSubscription.unsubscribe();
                this.closePopUp();
            }
        });
    }

    closePopUp(event?) {
        this.dialogClosed.emit(null);
    }
}