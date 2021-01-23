import { Component, OnInit } from '@angular/core';
import {
  serializedShelf,
  Shelf,
  bookSelectedEvent,
  Book,
  BookSerialized,
  Author,
  request,
  sortEvent,
  sortDirection,
  sorter,
  authorTemplate,
  bookTemplate,
  authorEvent,
  bookEvent,
  bookDeleteEvent,
} from "../types";
import { fakeRequest, sortByAuthor, sortByTitle } from "../utility";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private selectedBook: Book;
  private data: Shelf = [];
  private sDirection: sortDirection = "ascending";
  private sSorter: sorter = "none";

  public authors: Map<string, Author> = new Map();
  public books: Shelf = [];

  public get loaded(): boolean {
    return this.data?.length > 0;
  }

  public ngOnInit(): void {
    fakeRequest()
      .then((request: string) => {
        const result: request | null = JSON.parse(request);
        if (result !== null) {
          const { authors, books } = result;
          for (const author of authors) {
            this.authors.set(author.id, author);
          }
          this.data = books.map((bookS: BookSerialized): Book => {
            const { id, title, written, pages, authorId } = bookS;
            const author = this.authors.get(authorId);
            return { id, title, written, pages, author };
          });
          this.books = this.data;
        } else {
          throw "Fake request failed...";
        }
      })
  }

  public onBookSelected(event: bookSelectedEvent): void {
    if (this.selectedBook === event.item) {
      this.selectedBook = undefined;
    } else {
      this.selectedBook = event.item;
    }
  }

  public onSort(event: sortEvent) {
    this.selectedBook = undefined;
    const {
      direction,
      sortBy
    } = event;
    this.sDirection = direction;
    this.sSorter = sortBy;
    this.handleData();
  }

  public onAuthor(ev: authorEvent) {
    this.selectedBook = undefined;
    const id = ev.new ? this.genAuthorId() : this.authors.get(ev.change)?.id;
    if (!id) throw `Author with id ${ev.change} do not exist!`;
    const author: Author = {
      id,
      ...ev.item
    };
    this.authors.set(id, author);
  }

  public onBookDelete(ev: bookDeleteEvent): void {
    this.selectedBook = undefined;
    this.data = this.data.filter((book: Book) => book.id !== ev.id);
    this.handleData();
  }

  public onBook(ev: bookEvent): void {
    this.selectedBook = undefined;
    const id = ev.new ? this.genBookId() : ev.change;
    const author = this.authors.get(ev.authorId);
    if (id === undefined || author === null)
      throw `Book with id ${ev.change} or author id: ${ev.authorId} do not exist!`;
    const book: Book = {
      id,
      author,
      ...ev.item
    };
    if (ev.new) {
      this.data.push(book);
    } else {
      const bookIndex = this.findBookIndexById(id);
      this.data[bookIndex] = book;
    }
    this.handleData();
  }

  private handleData(): void {
    let data: null | Shelf = null;
    switch (this.sSorter) {
      case "none":
        data = this.data;
        break;
      case "title":
        data = sortByTitle(this.data, this.sDirection);
        break;
      case "author":
        data = sortByAuthor(this.data, this.sDirection);
    }
    this.books = data;
  }

  private findBookIndexById(id: string): number {
    for (let index = 0; index < this.data.length; index += 1) {
      const item: Book = this.data[index];
      if (item.id === id) {
        return index;
      }
    }
    return -1;
  }

  private genAuthorId(): string {
    let max = 0;
    for (const pair of this.authors.entries()) {
      const n = Number(pair[0]);
      if (n > max) {
        max = n;
      }
    }
    return String(max + 1);
  }

  private genBookId(): string {
    const max = this.data.reduce((cMax: number, current: Book) => {
      const id = Number(current.id);
      return id > cMax ? id : cMax;
    }, 0)
    return String(max + 1);
  }
}
