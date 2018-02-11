import { Component } from '@angular/core';
import * as $ from "jquery";

@Component({
  selector: 'main-menu-header',
  templateUrl: './main-menu-header.component.html',
  styleUrls: ['./main-menu-header.component.scss']
})
export class MenuComponent {
  showProjectsPage(event) {
    $('a').removeClass('active');
    $(event.target).addClass('active');
    $('projects').css('display', 'block');
  }
  
  showDashboardPage(event) {
    $('a').removeClass('active');
    $(event.target).addClass('active');
    $('projects').css('display', 'block');
  }

}