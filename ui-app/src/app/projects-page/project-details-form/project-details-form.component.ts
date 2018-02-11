import { Component, Input } from '@angular/core';

@Component({
    selector: 'project-details-form',
    templateUrl: './project-details-form.component.html',
    styleUrls: ['./project-details-form.component.scss']
  })
  export class ProjectDetailsComponent { 
      @Input() project: object;
  } 