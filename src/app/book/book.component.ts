import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  AnimationEvent
} from '@angular/animations';
import { Book, bookSelectedEvent } from "../../types";

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
  animations: [
    trigger('selectedUnselected', [
      state('unselected', style({
        width: "70px",
        height: "250px",
      })),
      state('selected', style({
        width: "200px",
        height: "250px",
      })),
      transition('selected => unselected', [
        animate('0.1s')
      ]),
      transition('unselected => selected', [
        animate('0.5s')
      ])
    ])
  ]
})
export class BookComponent implements OnChanges {
  @Input() props: {
    bookData: Book;
    selected: boolean;
  }
  @Output() select: EventEmitter<bookSelectedEvent> = new EventEmitter<bookSelectedEvent>();
  @HostBinding("class.selected") classSelected: boolean = false;
  public animationsState: string = "unselected";

  onClick(): void {
    this.select.emit({ item: this.props.bookData });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { selected } = changes.props.currentValue;
    if (selected) {
      this.classSelected = selected;
    }
  }

  onAnimationEvent(ev: AnimationEvent): void {
    //console.warn("ev", ev);
    if (ev.phaseName === "done" && ev.toState === "unselected") {
      this.classSelected = false;
    }
    this.animationsState = ev.toState;
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

  get pages(): number {
    return this.props.bookData.pages;
  }

  get written(): string {
    return this.props.bookData.written;
  }
}
