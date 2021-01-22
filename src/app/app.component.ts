import { Component, OnInit } from '@angular/core';
import { serializedShelf, Shelf, bookSelectedEvent, Book, BookSerialized, Author, request } from "../types";
import fakeRequest from "../fakeRequest";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private _selectedBook: Book;
  private inAnimation: boolean = false;
  public authors: Map<string, Author> = new Map();
  public data: Shelf[] = [];
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
          const { authors, shelfs } = result;
          for (const author of authors) {
            this.authors.set(author.id, author);
          }
          this.data = shelfs.map((shelf: serializedShelf): Shelf => {
            return shelf.map((bookS: BookSerialized): Book => {
              const { id, title, written, pages, authorId } = bookS;
              const author = this.authors.get(authorId);
              return { id, title, written, pages, author };
            })
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
}
