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
  authorTemplate,
  bookTemplate,
  authorEvent,
  bookEvent,
  bookDeleteEvent,
} from "../types";
import { fakeRequest } from "../utility";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private _selectedBook: Book;
  private inAnimation: boolean = false;
  public authors: Map<string, Author> = new Map();
  public data: Shelf = [];
  public formProps = {
    title: "test form",
    fields: [
      { type: "text", name: "text1" },
      { type: "text", name: "text2" }
    ]
  }
  public get firstBook(): Book {
    if (!this.loaded) return;
    return this.data[0][2];
  }
  public get loaded(): boolean {
    return this.data.length > 0;
  }
  public get selectedBook(): Book {
    return this._selectedBook;
  }
  ngOnInit(): void {
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
        } else {
          throw "Fake request failed.";
        }
      })
  }
  onBookSelected(event: bookSelectedEvent): void {
    if (this.inAnimation && !event.animationFinished) return;
    if (event.animationStart && this.selectedBook !== event.item) {
      this.inAnimation = true;
      this._selectedBook = event.item;
      return;
    };
    if (event.animationStart && this.selectedBook === event.item) {
      this.inAnimation = true;
      this._selectedBook = undefined;
      return;
    }
    if (event.animationFinished) {
      this.inAnimation = false;
    }
  }

  onSort(event: sortEvent) {
    console.log("sort", event);
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

  onAuthor(ev: authorEvent) {
    this._selectedBook = undefined;
    const id = ev.new ? this.genAuthorId() : this.authors.get(ev.change)?.id;
    if (!id) throw `Author with id ${ev.change} do not exist!`;
    const author: Author = {
      id,
      ...ev.item
    };
    this.authors.set(id, author);
    console.log("new author", this.authors);
  }

  onBookDelete(ev: bookDeleteEvent): void {
    this._selectedBook = undefined;
    this.data = this.data.filter((book: Book) => book.id !== ev.id);
  }

  onBook(ev: bookEvent): void {
    this._selectedBook = undefined;
    const id = ev.new ? this.genBookId() : ev.change;
    const author = this.authors.get(ev.authorId);
    if (id === undefined || author === null)
      throw `Book with id ${ev.change} or author id: ${ev.authorId} do not exist!`;
    console.log("auth", author);
    console.log("id", id);
    const book: Book = {
      id,
      author,
      ...ev.item
    };
    if (ev.new) {
      this.data.push(book);
    } else {
      for (let index = 0; index < this.data.length; index += 1) {
        const item: Book = this.data[index];
        if (item.id === id) {
          this.data[index] = book;
          break;
        }
      }
    }
  }
}
