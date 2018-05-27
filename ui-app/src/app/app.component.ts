import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
  <main-menu-header></main-menu-header>
  <view-modes-header></view-modes-header>
  <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
}
