import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 
import { ProjectComponent } from './../projects-page/projects-page.component';

const mainRoutes: Routes = [
    { path: 'projects', component: ProjectComponent }
  ];

@NgModule({
    imports: [
        RouterModule.forChild(mainRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class MainRoutingModule {}