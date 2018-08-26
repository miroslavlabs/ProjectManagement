import { Component, ViewChild, ElementRef } from '@angular/core';

import { ProjectDataService, BoardDataService, StoryDataService } from '../shared';
import { Project } from '../data-model/Project';
import { Board } from '../data-model/Board';
import { State } from '../data-model/State';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { DragulaService } from 'ng2-dragula';
import { Story } from '../data-model/Story';


@Component({
    selector: 'board-view',
    templateUrl: './board-view.component.html',
    styleUrls: ['./board-view.component.scss']
})
export class BoardComponent {
    projectId: number;
    boardId: number = 481;
    project: Project;
    projectTitle: string;
    projectBoards: Board[] = [];
    boardColumns: State[] = [];
    stories: Story[] = [];
    showCreateColumnDialog: boolean = false;
    showCreateStoryDialog: boolean = false;
    showCreateBoardDialog: boolean = false;
    entered: boolean = false;
    @ViewChild('columnsRow') columnsRow: ElementRef;

    MANY_ITEMS: string = 'MANY_ITEMS';
    many = ['The', 'possibilities', 'are', 'endless!'];
    many2 = ['Explore', 'them'];
    
    constructor(
        private projectDataService: ProjectDataService,
        private route: ActivatedRoute,
        private dragulaService: DragulaService,
        private boardDataService: BoardDataService,
        private storyDataService: StoryDataService) { 
            this.route.params.subscribe((params) => {
                this.projectId = +params['id'];
            });
            this.dragulaService.drag.subscribe((value) => {
                console.log(`drag: ${value[0]}`);
                this.onDrag(value.slice(1));
              });
              this.dragulaService.drop.subscribe((value) => {
                console.log(`drop: ${value[0]}`);
                this.onDrop(value.slice(1));
              });
              this.entered = true;
    }
    private onDrag(args) {
        let [e, el] = args;
        // do something
      }
      
      private onDrop(args) {
        let [e, el] = args;
        // do something
      }

    ngAfterViewInit() {
        let projectDetailsObservable: Observable<Project> =
        this.projectDataService.getProject(this.projectId);

        let projectDetailsSubscription: Subscription = projectDetailsObservable.subscribe({
            next: (projectData: Project) => {
                this.project = projectData[0];
                this.projectTitle = this.project.title;
            },
            error: (error) => { console.log(error); }, // TODO - show error message in form
            complete: () => {
                projectDetailsSubscription.unsubscribe();
            }
        });

        let boardsObservable: Observable<Board[]> =
            this.boardDataService.getBoards(this.projectId);

        let boardsSubscription = boardsObservable.subscribe({
            next: (boards: Board[]) => this.projectBoards = boards,
            error: (error) => { console.log(error) }, // TODO show error message
            complete: () => {
                boardsSubscription.unsubscribe();
            }
        });
        this.getCurrentBoardColumns();       
    }

    // ngAfterViewChecked() {
    //     if(this.entered) {
    //         this.getCurrentBoardColumns();
    //     }
    // }

    onChangeBoard(event) {
        let selectedBoardName = event.srcElement.value;
        for(let board of this.projectBoards) {
            if(board.name == selectedBoardName) {
                this.boardId = board.id;
                this.getCurrentBoardColumns();
            }
        }
    }

    getCurrentBoardColumns() {
        let columnsObservable: Observable<State[]> =
            this.boardDataService.getColumns(this.boardId);

        let columnSubscription = columnsObservable.subscribe({
            next: (columns: State[]) => {
                this.boardColumns = columns;
                this.calcColumnWidth();
                for(let column of this.boardColumns) {
                    this.getStories(column.id);
                }
            },
            error: (error) => { console.log(error) }, // TODO show error message
            complete: () => {
                columnSubscription.unsubscribe();
            }
        });
    }

    getStories(columnId: number) {
        let storiesObservable: Observable<Story[]> =
            this.storyDataService.getStories(columnId);

        let storiesSubscription = storiesObservable.subscribe({
            next: (stories: Story[]) => {
                this.stories = stories;
            },
            error: (error) => { console.log(error) }, // TODO show error message
            complete: () => {
                storiesSubscription.unsubscribe();
            }
        });
    }

    calcColumnWidth() {
        let rowWidth = this.columnsRow.nativeElement.clientWidth;
        let columnWidth = rowWidth/this.boardColumns.length;
        
        let columnsLength = this.columnsRow.nativeElement.children.length;
        for(let i = 0; i< columnsLength; i++ ) {
            this.columnsRow.nativeElement.children[i].style.width = columnWidth + 'px';
            this.entered = false;
        }
    }

    onColumnAdded(event) {
        this.boardColumns.push(event);
    }


    getBoardTemplate() {
        // let projectDetailsObservable: Observable<Project> =
        // this.projectDataService.getProject(this.projectId);

        // let projectDetailsSubscription: Subscription = projectDetailsObservable.subscribe({
        //     next: (projectData: Project) => {
        //         this.project = projectData[0];
        //     },
        //     error: (error) => { console.log(error); }, // TODO - show error message in form
        //     complete: () => {
        //         projectDetailsSubscription.unsubscribe();
        //     }
        // })
    }

    onCreateColumnClick() {
        this.showCreateColumnDialog = true;
    }

    onCloseDialog() {
        this.showCreateColumnDialog = false; 
    }

    onCreateStoryClick() {
        this.showCreateStoryDialog = true;
    }

    onCloseStoryDialog() {
        this.showCreateStoryDialog = false; 
    }

    onCreateBoardClick() {
        this.showCreateBoardDialog = true;
    }

    onCloseBoardDialog() {
        this.showCreateBoardDialog = false;
    }

    onAddBoard(event) {
        this.projectBoards.push(event);
    }
}