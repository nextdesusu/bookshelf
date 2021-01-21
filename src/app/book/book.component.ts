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
        width: "100%",
        height: "250px",
        borderRight: "2px solid rgba(192, 192, 192, 0.658)",
        borderLeft: "5px solid rgba(192, 192, 192, 0.884)",
      })),
      state('selected', style({
        width: "270%",
        height: "250px",
        borderRight: "3px solid rgba(192, 192, 192, 0.658)",
        borderLeft: "2px solid rgba(192, 192, 192, 0.884)",
      })),
      transition('selected => unselected', [
        animate('0.2s')
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
