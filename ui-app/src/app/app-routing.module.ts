import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 
import { ProjectComponent } from './projects-page/projects-page.component';
import { ProjectDetailsModule } from './project-details/project-details.module';

const appRoutes: Routes = [
    { path: '',   redirectTo: '/projects', pathMatch: 'full' }
  ];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes),
        ProjectDetailsModule
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {}