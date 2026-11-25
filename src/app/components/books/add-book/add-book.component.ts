import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { type FieldState, form, FormField } from '@angular/forms/signals';
import { IonGrid, IonInput, IonItem, IonList, IonNote, IonRow, IonTextarea, type IonModal } from '@ionic/angular';
import { catchError, EMPTY, map, type Observable, tap } from 'rxjs';
import { BookService } from 'services/book.service';

import type { CreateBookData } from './types';
import { createBookFormValidator } from './validator';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss'],
  imports: [IonList, IonItem, IonInput, IonTextarea, FormField, AsyncPipe, IonNote, IonGrid, IonRow],
})
export class AddBookComponent {
  private readonly bookService = inject(BookService);
  private readonly CREATE_BOOK_DATA_INITIAL_VALUES = Object.freeze({
    title: '',
    author: '',
    isbnNumber: '',
  });
  private readonly createBookModel = signal<CreateBookData>({ ...this.CREATE_BOOK_DATA_INITIAL_VALUES });
  public readonly createBookForm = form(this.createBookModel, createBookFormValidator);

  public getDisplayedFieldErrors(fieldState: FieldState<string, string>): string[] {
    if (!fieldState.touched() || !fieldState.invalid()) return [];
    return fieldState
      .errors()
      .map((e) => e.message ?? '')
      .filter(Boolean);
  }

  public submit(modal: IonModal): Observable<void> {
    if (!this.createBookForm().valid()) return EMPTY;

    return this.bookService.createBook(this.createBookForm().value()).pipe(
      tap(() => {
        this.createBookForm().reset({ ...this.CREATE_BOOK_DATA_INITIAL_VALUES });
        modal.dismiss();
      }),
      map(() => undefined),
      catchError((/*error*/) => {
        // TODO handle server errors when backend implements error handling
        return EMPTY;
      }),
    );
  }
}
