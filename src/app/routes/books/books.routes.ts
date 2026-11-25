import type { Routes } from '@angular/router';
import { BooksListComponent } from 'components/books/books-list/books-list.component';

export const booksRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: BooksListComponent,
    data: { title: 'Catalog' },
  },
];
