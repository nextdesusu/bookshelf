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
  constructor() {
    this.formComponent = new FormGroup({
      firstName: new FormControl("", Validators.required),
      lastName: new FormControl("", Validators.required),
      patronym: new FormControl("")
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (!changes.props.currentValue?.book) return;
    const { firstName, lastName, patronym } = changes.props.currentValue.book.author;
    this.formComponent.setValue({ firstName, lastName, patronym: patronym ? patronym : "" });
  }
  onSubmit() {
    console.log(this.formComponent);
  }
}
