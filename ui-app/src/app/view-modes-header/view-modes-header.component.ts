import { Component } from '@angular/core';
import * as $ from "jquery";

@Component({
  selector: 'view-modes-header',
  templateUrl: './view-modes-header.component.html',
  styleUrls: ['./view-modes-header.component.scss']
})
export class ViewModesComponent { 
    toggleViewModesHeader() {
        $('.arrow svg').toggleClass('fa-chevron-right fa-chevron-left');
        $('#views-header').toggleClass('normal-views-header expanded-views-header');
        $('.projects-container').css('margin-left', '140px');
    }
}