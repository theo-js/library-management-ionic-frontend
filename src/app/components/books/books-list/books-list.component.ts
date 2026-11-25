import { AsyncPipe } from '@angular/common';
import { Component, inject, type OnDestroy, type OnInit, signal, ViewChild } from '@angular/core';
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonLabel,
  IonList,
  IonListHeader,
} from '@ionic/angular';
import type { IonModal } from '@ionic/angular/common';
import { ModalComponent } from 'components/ui/modal/modal.component';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { type Subscription, switchMap, take } from 'rxjs';
import { BookService } from 'services/book.service';

import { AddBookComponent } from '../add-book/add-book.component';

import { BookListItemComponent } from './book-list-item/book-list-item.component';

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss'],
  imports: [
    IonContent,
    IonList,
    IonLabel,
    IonListHeader,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonFab,
    IonFabButton,
    IonIcon,
    AsyncPipe,
    AddBookComponent,
    BookListItemComponent,
    ModalComponent,
  ],
})
export class BooksListComponent implements OnInit, OnDestroy {
  private bookService = inject(BookService);
  public readonly isEndOfInfiniteScroll = signal<boolean>(false);
  private subscriptions: Subscription[] = [];

  @ViewChild(AddBookComponent, { static: false }) public addBookForm?: AddBookComponent;

  constructor() {
    addIcons({ add });
  }

  ngOnInit(): void {
    this.subscriptions.push(this.bookService.fetchAllBooksForNextPage().pipe(take(1)).subscribe());
  }

  public fetchNextBooks(event?: CustomEvent): void {
    this.subscriptions.push(
      this.bookService
        .fetchAllBooksForNextPage()
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            const nextBooksCount = response.body?.length ?? 0;
            if (nextBooksCount === 0) this.isEndOfInfiniteScroll.set(true);

            (event?.target as HTMLIonInfiniteScrollElement)?.complete();
          },
          error: () => {
            (event?.target as HTMLIonInfiniteScrollElement)?.complete();
          },
        }),
    );
  }

  public handleAddBookConfirmed(modal: IonModal): void {
    if (!this.addBookForm) return;

    this.subscriptions.push(
      this.addBookForm
        .submit(modal)
        .pipe(
          switchMap(() => {
            this.bookService.resetFetchAllBooksCurrentPage();
            return this.bookService.fetchAllBooksForNextPage();
          }),
        )
        .subscribe(),
    );
  }

  ngOnDestroy(): void {
    this.bookService.resetFetchAllBooksCurrentPage();
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
