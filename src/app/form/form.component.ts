import {
  Component, Input, OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { getFullName } from "../../utility";
import { Book, Author } from "../../types";

const formDefault = {
  firstName: "отсутствует",
  lastName: "отсутствует",
  patronym: "отсутствует",

  author: "",
  title: "отсутствует",
  written: "отсутствует",
  pages: 0
};

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
  public authorsList: any = [];
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
    const { authors, book } = changes.props.currentValue;
    if (authors === undefined) return;
    this.authorsList = Array.from(authors.entries()).map((pair) => {
      return { name: getFullName(pair[1]), id: pair[0] };
    });
    if (book === undefined) {
      this.formComponent.setValue(formDefault);
    } else {
      const { author, title, written, pages } = book;
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
  }

  public onSubmit() {
    console.log(this.formComponent);
  }

  public swapState() {
    this.state = this.state === "author" ? "book" : "author";
  }

  public currentAuthorName(): string {
    const { book } = this.props;
    if (book === undefined) return "отсутствует";
    return getFullName(book.author);
  }
}
