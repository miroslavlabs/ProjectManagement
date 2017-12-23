import { Component } from '@angular/core';

@Component({
  selector: 'projects-page',
  templateUrl: './projects-page.component.html',
  styleUrls: ['./projects-page.component.scss']
})
export class ProjectComponent {
  projects = [
      {
        id: 1,
        projectName: 'My new project',
        shortProjDesc: 'My new project is very flexible, callaborative and easy to manage.'
      },
      {
        id: 2,
        projectName: 'My new project2',
        shortProjDesc: 'My new project is very flexible, callaborative and easy to manage.'
      },
      {
        id: 3,
        projectName: 'My new project3',
        shortProjDesc: 'My new project is very flexible, callaborative and easy to manage.'
      }
    ];

}
