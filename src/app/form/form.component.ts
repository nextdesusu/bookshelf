import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { getFullName, forbiddenValue, writtenValidator, pagesValidator } from "../../utility";
import { Book, Author, authorTemplate, bookTemplate, authorEvent, bookEvent, bookDeleteEvent } from "../../types";

const formsDefault = {
  author: {
    firstName: "",
    lastName: "",
    patronym: "",
  },
  book: {
    author: "-1",
    title: "",
    written: "",
    pages: 0
  }
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
  @Output() bookEvent: EventEmitter<bookEvent> = new EventEmitter<bookEvent>();
  @Output() authorEvent: EventEmitter<authorEvent> = new EventEmitter<authorEvent>();
  @Output() bookDeleteEvent: EventEmitter<bookDeleteEvent> = new EventEmitter<bookDeleteEvent>();
  public authorsList: { name: string, id: string }[] = [];
  public state: "book" | "author" | "delete" = "book";

  public authorForm: FormGroup;
  public bookForm: FormGroup;
  constructor() {
    this.authorForm = new FormGroup({
      firstName: new FormControl("", Validators.required),
      lastName: new FormControl("", Validators.required),
      patronym: new FormControl(""),
    });
    this.bookForm = new FormGroup({
      author: new FormControl("-1", [Validators.required, forbiddenValue(/-1/)]),
      title: new FormControl("", Validators.required),
      written: new FormControl("", [Validators.required, writtenValidator]),
      pages: new FormControl(0, [Validators.required, pagesValidator])
    })
  }

  private updateAuthorsList(): void {
    const { authors } = this.props;
    this.authorsList = Array.from(authors.entries())
      .map((pair) => ({ name: getFullName(pair[1]), id: pair[0] }));
  }

  ngOnChanges(changes: SimpleChanges) {
    const { authors, book } = changes.props.currentValue;
    if (authors === undefined) return;
    this.updateAuthorsList();
    if (book === undefined) {
      this.authorForm.setValue(formsDefault.author);
      this.bookForm.setValue(formsDefault.book);
    } else {
      const { author, title, written, pages } = book;
      const { firstName, lastName, patronym } = author;
      this.authorForm.setValue({
        firstName,
        lastName,
        patronym: patronym ? patronym : "",
      });
      this.bookForm.setValue({
        author: author.id,
        title,
        written,
        pages
      });
    }
  }

  public onSubmit() {
    const bookSelected = this.props.book !== undefined;
    if (this.state === "book") {
      if (this.bookForm.status !== "VALID") return;
      const {
        title,
        written,
        pages,
        author
      } = this.bookForm.value;
      const book: bookTemplate = {
        title,
        written,
        pages
      };
      this.bookEvent.emit({
        new: !bookSelected,
        item: book,
        change: bookSelected ? this.props.book.id : undefined,
        authorId: author
      })
    } else {
      if (this.authorForm.status !== "VALID") return;
      const {
        firstName,
        lastName,
        patronym
      } = this.authorForm.value;
      const author: authorTemplate = {
        firstName,
        lastName,
        patronym
      };
      this.authorEvent.emit({
        new: !bookSelected,
        item: author,
        change: bookSelected ? this.props.book.author.id : undefined
      })
      this.updateAuthorsList();
      this.toBookForm();
    }
  }

  public deleteBook(): void {
    this.bookDeleteEvent.emit({ id: this.props.book.id });
    this.toBookForm();
  }

  public swapState(): void {
    this.state = this.state === "author" ? "book" : "author";
  }

  public toBookForm(): void {
    this.state = "book";
  }

  public toDeleteForm(): void {
    this.state = "delete";
  }

  public currentAuthorName(): string {
    const { book } = this.props;
    if (book === undefined) return "отсутствует";
    return getFullName(book.author);
  }
}
