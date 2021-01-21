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
  written: string;
  pages: number;
}

export type Shelf = Book[];

export interface bookSelectedEvent {
  readonly item: Book;
}
