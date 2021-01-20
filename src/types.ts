export interface Author {
  readonly id: string;
  firstName: string;
  lastName: string;
  patronym?: string;
}

export interface Book {
  readonly id: string;
  author: Author;
  title: string;
}

export interface Shelf {
  books: Book[];
}
