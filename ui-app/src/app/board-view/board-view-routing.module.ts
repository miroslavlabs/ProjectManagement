import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 
import { ProjectComponent } from '../projects-page/projects-page.component';

const boardsRoutes: Routes = [
    { path: 'projects', component: ProjectComponent }
  ];

@NgModule({
    imports: [
        RouterModule.forChild(boardsRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class BoardsRoutingModule {}