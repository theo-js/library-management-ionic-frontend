import { Component, input } from '@angular/core';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonLabel } from '@ionic/angular';
import type { BookResponse } from 'dtos/library/books/BookResponse.dto';

@Component({
  selector: 'app-book-list-item',
  templateUrl: './book-list-item.component.html',
  styleUrls: ['./book-list-item.component.scss'],
  imports: [IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle, IonLabel],
})
export class BookListItemComponent {
  public readonly book = input.required<BookResponse>();
}
