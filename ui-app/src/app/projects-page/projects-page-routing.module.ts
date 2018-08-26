import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 
import { ProjectComponent } from './projects-page.component';
import { BoardComponent } from '../board-view/board-view.component';

const projectPageRoutes: Routes = [
    { path: 'projects', component: ProjectComponent },
    { path: 'project/:id/boards', component: BoardComponent }
  ];

@NgModule({
    imports: [
        RouterModule.forChild(projectPageRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class ProjectsPageRoutingModule {}