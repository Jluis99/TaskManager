import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './template/header/header.component';
import { TaskListComponent } from './task/task-list/task-list.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, TaskListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'TaskManager';
}
