import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 
import { ProjectDetailsDialogComponent }    from './';
import { ProjectDetailsComponent }  from './../project-details/project-details.component';
 
const projectsRoutes: Routes = [
];
 
@NgModule({
  imports: [
    RouterModule.forChild(projectsRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ProjectRoutingModule { }