import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 
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