import { HttpClient, type HttpResponse } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import type { AddBookCommand } from 'dtos/library/books/AddBookCommand';
import type { BookResponse } from 'dtos/library/books/BookResponse.dto';
import { environment } from 'environments/environment';
import { BehaviorSubject, finalize, type Observable, take, tap } from 'rxjs';
import { NumberUtils } from 'utils/number.utils';

type BooksState = { books: BookResponse[]; isFetching: boolean; totalCount: number };

@Service()
export class BookService {
  private http = inject(HttpClient);

  // -- SEARCH BOOKS --
  private readonly INITIAL_BOOKS_STATE: BooksState = {
    books: [],
    isFetching: false,
    totalCount: 0,
  };
  private _booksState$ = new BehaviorSubject<BooksState>(this.INITIAL_BOOKS_STATE);
  public booksState$ = this._booksState$.asObservable();

  private readonly FETCH_ALL_BOOKS_PAGE_SIZE: number = 3;
  private readonly FETCH_ALL_BOOKS_INITIAL_PAGE: number = 1;
  private fetchAllBooksCurrentPage: number = this.FETCH_ALL_BOOKS_INITIAL_PAGE;

  private fetchAllBooksForCurrentPage(): Observable<HttpResponse<BookResponse[]>> {
    this._booksState$.next({ ...this._booksState$.value, isFetching: true });

    return this.http
      .get<BookResponse[]>(`${environment.backend.libraryApi.baseUrl}/books`, {
        headers: {
          'X-Page': this.fetchAllBooksCurrentPage.toString(),
          'X-Page-Size': this.FETCH_ALL_BOOKS_PAGE_SIZE.toString(),
        },
        observe: 'response',
      })
      .pipe(
        take(1),
        tap((response) => {
          const totalCount = NumberUtils.parseIntOrUndefined(response.headers.get('X-Total-Count') ?? '') ?? 0;
          const nextBooks = response.body ?? [];
          this._booksState$.next({
            ...this._booksState$.value,
            books: [...this._booksState$.value.books, ...nextBooks],
            totalCount,
          });
        }),
        finalize(() => this._booksState$.next({ ...this._booksState$.value, isFetching: false })),
      );
  }

  public fetchAllBooksForNextPage(): Observable<HttpResponse<BookResponse[]>> {
    const observable = this.fetchAllBooksForCurrentPage();
    this.fetchAllBooksCurrentPage++;
    return observable;
  }
  public resetFetchAllBooksCurrentPage(): void {
    this.fetchAllBooksCurrentPage = this.FETCH_ALL_BOOKS_INITIAL_PAGE;
    this._booksState$.next(this.INITIAL_BOOKS_STATE);
  }

  // -- CREATE A BOOK --
  private _isCreatingBook$ = new BehaviorSubject<boolean>(false);
  public isCreatingBook$ = this._isCreatingBook$.asObservable();
  public createBook(addBookCommand: AddBookCommand): Observable<BookResponse> {
    this._isCreatingBook$.next(true);
    return this.http
      .post<BookResponse>(`${environment.backend.libraryApi.baseUrl}/books`, addBookCommand)
      .pipe(finalize(() => this._isCreatingBook$.next(false)));
  }
}
