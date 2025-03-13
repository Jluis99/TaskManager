import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from '../../interface/Task';
import { CommonModule } from '@angular/common';
import { EmitterTO } from '../../to/EmitterTO';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnInit {

  @Input() taskSelected!: Task;
  @Output() taksEmitter: EventEmitter<EmitterTO> = new EventEmitter<EmitterTO>();

  taskForm!: FormGroup;
  emitterTO: EmitterTO = {
    isCancel: false,
  };

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    // Se inicializa el formulario reactivo con sus validaciones.
    this.taskForm = this.fb.group({
      title: [this.taskSelected?.title ?? '', Validators.required],
      description: [this.taskSelected?.description?? '', [Validators.required]],
      state: [this.taskSelected?.state?? 0, [Validators.required]]
    })
  }


  submit() {
    // Valida que el formulario cumpla con las validaciones y realiza el emit al componente padre.
    if (this.taskForm.valid) {
      this.setValues();
      this.emitterTO.task = this.taskSelected;
      this.emitterTO.isCancel = false;
      this.taksEmitter.emit(this.emitterTO);
    } else {
      console.log('taskForm inválido');
      this.taskForm.markAllAsTouched();
    }
  }

  // Setea los valores del formulario al objeto recibido del padre.
  setValues() {
    this.taskSelected.title = this.taskForm.value.title;
    this.taskSelected.description = this.taskForm.value.description;
  }

  // Cancela el formulario para mostrar de nuevo la tabla.
  cancelForm() {
    this.emitterTO.isCancel = true;
    this.taksEmitter.emit(this.emitterTO);
  }
  
}
