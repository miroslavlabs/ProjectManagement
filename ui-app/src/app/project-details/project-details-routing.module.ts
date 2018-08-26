import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProjectDetailsComponent } from './project-details.component';

const projectDetailsRoutes: Routes = [
    {
        path: 'projectDetails/edit/:id',
        component: ProjectDetailsComponent
    },
    {
        path: 'projectDetails/add',
        component: ProjectDetailsComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(projectDetailsRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class ProjectDetailsRoutingModule { }