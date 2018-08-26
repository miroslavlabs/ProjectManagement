import { NgModule } from '@angular/core';
//import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { ViewModesComponent } from './view-modes-header.component';
import { SharedModule } from '../../shared';

@NgModule({
    imports: [ 
        //BrowserModule,
        CommonModule,
        SharedModule
    ],
    declarations: [ 
        ViewModesComponent
    ],
    providers: [],
    exports: [ ViewModesComponent ]
  })
  export class ViewModesModule { }