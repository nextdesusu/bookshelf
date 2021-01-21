import { Component, OnInit } from '@angular/core';
import { Shelf, bookSelectedEvent, Book } from "../types";
import fakeRequest from "../fakeRequest";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private _selectedBook: Book;
  private inAnimation: boolean = false;
  public data: Array<Shelf> = [];
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
        const result = JSON.parse(request);
        if (result) {
          this.data = result;
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
