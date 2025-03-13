import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Task } from '../../interface/Task';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { TooltipDirective } from 'ngx-bootstrap/tooltip';
import { TaskFormComponent } from '../task-form/task-form.component';
import { EmitterTO } from '../../to/EmitterTO';
import { TaskService } from '../../services/task.service';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-task-list',
  imports: [TableModule, CommonModule, BreadcrumbModule, TooltipDirective, TaskFormComponent, DropdownModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
  standalone: true
})
export class TaskListComponent implements OnInit {

  tasks: Task[] = [];
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  showForm = false;
  taskSelected!: Task;

  // Opciones usadas para el filtro.
  statusOptions = [
    { label: 'Todos', value: null },
    { label: 'Completada', value: 1 },
    { label: 'Incompleta', value: 0 }
  ];

  constructor(private taskService: TaskService) { }

  ngOnInit() {
    // Valores del breadcrumb
    this.items = [
      { label: 'Lista de tareas' }
    ];
    this.home = { icon: 'pi pi-home', routerLink: '/' };

    // Llama al servicio que obtiene la lista de tareas.
    this.getAllTasks();
  }

  // Obtiene la lista de tareas.
  getAllTasks() {
    this.taskService.getAllTasks().subscribe({
      next: (data: Task[]) => {
        this.tasks = data;
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  // Agrega el valor al breadcrumb y muestra el formulario vacio.
  addTask() {
    this.items?.push({label: "Adicionar tarea"});
    this.resetTaskSelected();
    this.showForm = true;
  }
  
  // Agrega el valor al breadcrumb y muestra el formulario con los valores de la tarea seleccionada.
  editTask(task: Task) {
    this.items?.push({label: "Editar Task"});
    this.taskSelected = task;
    this.showForm = true;
  }

  // Receptor del componente hijo
  reciveEmitter(emitterTO: EmitterTO) {
    // Elimina el ultimo elemento del breadcrumb
    this.items?.pop();
    if (emitterTO && !emitterTO.isCancel && emitterTO.task) {
      const task = emitterTO.task;
      // Se valida si el objeto tiene un id o no. 
      // Depende de eso es un nuevo registro o una edición de uno existente.
      if (task.id == null) {
        this.saveTask(task);
        this.tasks.push(task);
      }else {
        this.updateTask(task);
      }
    }
    this.showForm = false;
  }

  // Método para completar las tareas.
  completeTask(task: Task) {
    task.state = 1;
    this.updateTask(task);
  }

  // Llama al servicio de eliminar y borra del listado el item seleccionado.
  deleteTask(task: Task) {
    if (task && task.id) { 
      this.taskService.deleteTask(task.id).subscribe({
        next: () => {
          let index = this.tasks.findIndex(t => t.id === task.id);
          if (index != -1) this.tasks.splice(index, 1);
        },
        error: (err) => {
          console.error(err);
        }
      })
    }

  }

  // Llama al servicio de guardado.
  saveTask(task: Task) {
    this.taskService.saveTask(task).subscribe({
      next: (data: Task) => {
        this.taskSelected = data;
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  // Llama al servicio de actualizado.
  updateTask(task: Task) {
    if (task && task.id) {
      this.taskService.updateTask(task.id, task).subscribe({
        next: (data) => {
          this.taskSelected = data;
        },
        error: (err) => {
          console.error(err);
        }
      })
    }
  }

  // Reinicia el objeto de taskSelected.
  resetTaskSelected() {
    this.taskSelected = {
      title: '',
      description: '',
      state: 0
    };
  }
}
