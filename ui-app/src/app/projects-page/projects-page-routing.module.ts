import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 
import { ProjectComponent } from './projects-page.component';

const projectPageRoutes: Routes = [
    { path: 'projects', component: ProjectComponent }
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