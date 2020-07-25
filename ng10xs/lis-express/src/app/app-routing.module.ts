import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './page-components/home/home.component';
import { LoginComponent } from './page-components/login/login.component';
import { PageNotFoundComponent  } from './page-components/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'notes',
    loadChildren: () => import('./modules/notes/notes.module').then(m => m.NotesModule)
  },
  {
    path: 'bookmarks',
    loadChildren: () => import('./modules/bookmarks/bookmarks.module').then(m => m.BookmarksModule)
  },
  { path: '404', component: PageNotFoundComponent },
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule { }
