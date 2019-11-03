import { Component, ViewChild } from '@angular/core';
import { DartboardComponent } from './match/dartboard/dartboard.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'todo-app';

  @ViewChild(DartboardComponent, { static: false }) dartboard: DartboardComponent;

  reset() {
    this.dartboard.reset();
  }
}
