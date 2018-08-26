import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { BoardComponent } from './board-view.component';
import { SharedModule } from '../shared';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from 'ng2-ckeditor';

import { HttpClient } from '@angular/common/http';
import { ProjectDataService } from '../shared';
import { BoardsRoutingModule } from './board-view-routing.module';
import { CreateBoardDialogComponent } from './create-boards-dialog/create-boards-dialog.component';
import { BoardCreateStoryDialogComponent } from './boards-create-story/boards-create-story.component';
import { BoardCreateColumnDialogComponent } from './boards-create-column/boards-create-column.component';

import { DragulaModule } from 'ng2-dragula';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BoardsRoutingModule,
        CKEditorModule,
        HttpClientModule,
        SharedModule,
        DragulaModule,
        
    ],
    declarations: [
        BoardComponent,
        CreateBoardDialogComponent,
        BoardCreateStoryDialogComponent,
        BoardCreateColumnDialogComponent
    ],
    providers: [ ProjectDataService, HttpClient],
    exports: [BoardComponent]
})
export class BoardsModule { }