export interface authorTemplate {
  firstName: string;
  lastName: string;
  patronym?: string;
}

export interface Author extends authorTemplate {
  readonly id: string;
}

export interface bookTemplate {
  title: string;
  written: string;
  pages: number;
}

export interface bookProperties extends bookTemplate {
  readonly id: string;
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

export type sortDirection = "ascending" | "descending";
export type sorter = "none" | "title" | "author";

export interface sortEvent {
  direction: sortDirection;
  sortBy: sorter;
}

interface formEvent {
  readonly new: boolean;
  change?: string;
}

export interface authorEvent extends formEvent {
  readonly item: authorTemplate;
}

export interface bookEvent extends formEvent {
  readonly authorId: string;
  readonly item: bookTemplate;
}

export interface bookDeleteEvent {
  readonly id: string;
}
