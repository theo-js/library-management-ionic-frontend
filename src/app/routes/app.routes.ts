import type { Routes } from '@angular/router';

import { RootLayoutComponent } from '../components/layout/root-layout/root-layout.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: RootLayoutComponent,
    children: [
      {
        path: 'books',
        loadChildren: () => import('./books/books.routes').then((m) => m.booksRoutes),
      },
      {
        path: 'foo',
        loadComponent: () => import('../components/foo/foo.component').then((m) => m.FooComponent),
        data: { title: 'Foo' },
      },
      {
        path: '**',
        redirectTo: 'books',
      },
    ],
  },
];
