import { Component, Output, OnInit } from '@angular/core';
import * as $ from "jquery";

@Component({
  selector: 'view-modes-header',
  templateUrl: './view-modes-header.component.html',
  styleUrls: ['./view-modes-header.component.scss']
})
export class ViewModesComponent implements OnInit { 
    visible: boolean = false;
    @Output() createProject: Object;

    ngOnInit() {
        this.createProject = {
            isEditAction: false,
            isAddAction: true
        }
    }

    toggleViewModesHeader() {
        $('.arrow svg').toggleClass('fa-chevron-right fa-chevron-left');
        $('#views-header').toggleClass('normal-views-header expanded-views-header');
        $('.container').toggleClass('projects-container-move');
        $('.label-hide').toggleClass('label-show');
        $('.add-btn-container').toggleClass('full-items');
        $('.header-item').toggleClass('full-items');
    }

    addNewProject() {
        this.visible = true;
    }

    onCloseForm(event) {
        this.visible = false;
    }
}