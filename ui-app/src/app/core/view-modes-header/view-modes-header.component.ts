import { Component, Output, OnInit, ViewChild, ElementRef} from '@angular/core';
import * as $ from "jquery";

@Component({
  selector: 'view-modes-header',
  templateUrl: './view-modes-header.component.html',
  styleUrls: ['./view-modes-header.component.scss']
})
export class ViewModesComponent implements OnInit { 
    visible: boolean = false;
    isExpanded: boolean = false;
    @Output() createProject: Object;
    @ViewChild('arrow') arrow: ElementRef;
    dialogTitle: string = "Create Project";

    ngOnInit() {
        this.createProject = {
            isEditAction: false,
            isAddAction: true
        }
    }

    toggleViewModesHeader() {
        if(this.isExpanded === false) {
            this.isExpanded = true;
        } else {
            this.isExpanded = false;
        }
        $('.arrow svg').toggleClass('fa-chevron-right fa-chevron-left');
        $('.container').toggleClass('projects-container-move');
    }

    addNewProject() {
        this.visible = true;
    }

    onCloseForm(event) {
        this.visible = false;
    }
}