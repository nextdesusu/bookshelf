import {
  Component, OnInit, Input, OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

interface fieldDescription {
  type: "text" | "number";
  name: string;
  defaultValue?: string;
  required?: boolean;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnChanges {
  @Input() props: {
    book: any;
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
}
