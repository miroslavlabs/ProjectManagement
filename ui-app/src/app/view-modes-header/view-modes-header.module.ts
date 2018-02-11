import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ViewModesComponent } from './view-modes-header.component';

@NgModule({
    imports: [ BrowserModule ],
    declarations: [ ViewModesComponent ],
    providers: [],
    exports: [ ViewModesComponent ]
  })
  export class ViewModesModule { }