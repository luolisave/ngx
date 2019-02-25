import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoteEditComponent } from './note-edit/note-edit.component';

const routes: Routes = [
  {
    path: 'edit',
    component: NoteEditComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})

export class NotesRoutingModule { }
