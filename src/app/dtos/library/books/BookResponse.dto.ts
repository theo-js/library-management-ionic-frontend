import type { BookCopyResponse } from './BookCopyResponse.dto';

export type BookResponse = {
  id: string;
  title: string;
  author: string;
  isbnNumber: string;
  copies: BookCopyResponse[];
};
