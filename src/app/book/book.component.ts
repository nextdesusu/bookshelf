import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef
} from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  AnimationEvent,
  keyframes
} from '@angular/animations';
import { getFullName } from "../../utility";
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
        zIndex: "1"
      })),
      state('selected', style({
        width: "270%",
        height: "250px",
        borderRight: "5px solid rgba(192, 192, 192, 0.658)",
      })),
      transition('selected => unselected', [
        animate('0.1s', style({
          color: "rgba(0, 0, 0, 0)",
          width: "180%",
        }))
      ]),
      transition('unselected => selected', [
        animate('0.4s', keyframes([
          style({
            color: "rgba(0, 0, 0, 0)",

            borderRight: "100px solid black",
            borderRadius: "0 0 3em 0"
          })
        ]))
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
  constructor(private changeDetector: ChangeDetectorRef) { }
  public animationsState: string = "unselected";

  onClick(): void {
    this.select.emit({ item: this.props.bookData, animationStart: true, animationFinished: false });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { selected } = changes.props.currentValue;
    this.classSelected = selected;
  }

  onAnimationEnd(ev: AnimationEvent): void {
    if (ev.fromState === "void") return;
    this.animationsState = ev.toState;
    this.select.emit({ item: this.props.bookData, animationStart: false, animationFinished: true });
    this.changeDetector.detectChanges();
  }

  get title(): string {
    const { title } = this.props.bookData;
    const first = title.charAt(0).toUpperCase();
    const rest = title.slice(1);
    return first + rest;
  }

  get author(): string {
    return getFullName(this.props.bookData.author);
  }

  get pages(): number {
    return this.props.bookData.pages;
  }

  get written(): string {
    const { written } = this.props.bookData;
    const postfix: string = written.includes("-") ? "годах" : "году";
    return `в ${written}  ${postfix}`;
  }

  get unselected(): boolean {
    return this.animationsState === 'unselected';
  }
}
