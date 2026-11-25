import { type PathKind, required, type SchemaOrSchemaFn } from '@angular/forms/signals';

import type { CreateBookData } from './types';

export const createBookFormValidator: SchemaOrSchemaFn<CreateBookData, PathKind.Root> = (schemaPath) => {
  required(schemaPath.title, { message: 'The book title is required.' });

  required(schemaPath.author, { message: 'The book author is required.' });

  required(schemaPath.isbnNumber, { message: 'The ISBN number is required.' });
};
