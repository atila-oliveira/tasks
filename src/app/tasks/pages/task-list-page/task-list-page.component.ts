import { TaskRepository } from './../../repositories/task.repository';
import { ITask } from './../../models/itask';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-list-page',
  templateUrl: './task-list-page.component.html',
  styleUrls: ['./task-list-page.component.scss']
})
export class TaskListPageComponent implements OnInit {
  // Recuperando o elemento "<table></table>" da tela
  // Porem aqui o componente de tabela é do angular material,
  // Com isso eu uso o tipo MatTable
  @ViewChild(MatTable) table: MatTable<ITask> | undefined;

  tasks: ITask[] = [];
  displayedColumns = [
    'id',
    'title',
    'description',
    'done',
    'action'
  ];

  constructor(
    private taskRepository: TaskRepository,
    private snack: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getAllTasks();
  }

  getAllTasks(): void {
    this.taskRepository.getAll().subscribe({
      next: (response: ITask[]) => {
        this.tasks = response;
      },
      error: () => {
        this.snack.open('Erro ao buscar todas tarefas');
        this.tasks = [];
      }

    })
  }

  deleteTask(task: ITask): void {
    //deletando a tarefa da api
    this.taskRepository.delete(task.id || '').subscribe({
      next: () => {
        // removendo a tarefa do array de tarefas
        this.tasks.splice(this.tasks.indexOf(task), 1);
        // renderizando novamente as linhas da tabela para a tarefa que acabou
        // de ser excluída não apareça
        // com isso não preciso recarregar a tela novamente
        this.table?.renderRows();
        this.snack.open('Tarefa excluída com sucesso!')
      },
      error: () => this.snack.open('Erro ao deletar tarefa')
    });
  }
}
