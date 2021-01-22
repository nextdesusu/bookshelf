import {
  Component, Input, OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Book, Author } from "../../types";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnChanges {
  @Input() props: {
    book: Book;
    authors: Map<string, Author>;
  }
  public formComponent: FormGroup;
  public state: "book" | "author" = "book";
  constructor() {
    this.formComponent = new FormGroup({
      firstName: new FormControl("", Validators.required),
      lastName: new FormControl("", Validators.required),
      patronym: new FormControl(""),

      author: new FormControl("", Validators.required),
      title: new FormControl("", Validators.required),
      written: new FormControl("", Validators.required),
      pages: new FormControl(0, Validators.required)
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (!changes.props.currentValue?.book) return;
    const { author, title, written, pages } = changes.props.currentValue.book;
    const { firstName, lastName, patronym } = author;
    this.formComponent.setValue({
      firstName,
      lastName,
      patronym: patronym ? patronym : "",

      author: "0",
      title,
      written,
      pages
    });
  }
  onSubmit() {
    console.log(this.formComponent);
  }
  swapState() {
    this.state = this.state === "author" ? "book" : "author";
  }
  get authorsList() {
    const { authors } = this.props;
    if (authors === undefined) return [];
    return Array.from(authors.entries()).map((pair) => {
      const { lastName, firstName, patronym } = pair[1];
      const patronymOrEmpty = `${patronym ? patronym : ""}`
      return { name: `${lastName} ${firstName} ${patronymOrEmpty}`, id: pair[0] };
    })
  }
  isSelectedAuthor(authorId: string): boolean {
    const { book } = this.props;
    if (!book) return false;
    return authorId === book.author.id;
  }
}
