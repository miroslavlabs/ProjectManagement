import { Component, ViewChildren, QueryList } from '@angular/core';
import * as $ from "jquery";
import { Router } from '@angular/router';

@Component({
  selector: 'main-menu-header',
  templateUrl: './main-menu-header.component.html',
  styleUrls: ['./main-menu-header.component.scss']
})
export class MenuComponent {
    @ViewChildren('menuLink') menuLinks: QueryList<any>;

    constructor( private router: Router) {}

    showProjectsPage(event) {
        this.menuLinks.forEach( menuLink => {
            menuLink.nativeElement.removeClass('active');
        });
        event.target.addClass('active');
        $('projects').css('display', 'block');
        this.router.navigate(['/projects']);
    }
    
    showDashboardPage(event) {
        this.menuLinks.forEach( menuLink => {
            menuLink.nativeElement.removeClass('active');
        });
        event.target.addClass('active');
        $('projects').css('display', 'block');
    }

}