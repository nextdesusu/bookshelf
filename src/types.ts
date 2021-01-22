export interface Author {
  readonly id: string;
  firstName: string;
  lastName: string;
  patronym?: string;
}

interface bookProperties {
  readonly id: string;
  title: string;
  written: string;
  pages: number;
}

export interface Book extends bookProperties {
  author: Author;
}

export interface BookSerialized extends bookProperties {
  authorId: string;
}

export type Shelf = Book[];
export type serializedShelf = BookSerialized[];

export interface request {
  books: serializedShelf;
  authors: Author[];
}

export interface bookSelectedEvent {
  readonly item: Book;
  animationStart: boolean;
  animationFinished: boolean;
}
