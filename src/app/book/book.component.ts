import { Component, Input } from '@angular/core';
import { Book } from "../../types";

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent {
  @Input() props: {
    bookData: Book;
    selected: boolean;
  }

  get title(): string {
    return this.props.bookData.title;
  }

  get author(): string {
    const {
      lastName,
      firstName,
      patronym,
    } = this.props.bookData.author;
    const patronymOrEmpty = patronym ? ` ${patronym}` : "";
    return `${lastName} ${firstName}${patronymOrEmpty}`;
  }
}
