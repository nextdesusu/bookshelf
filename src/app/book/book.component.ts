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
import { Book, bookSelectedAnimationEvent } from "../../types";

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
  animations: [
    trigger('selectedUnselected', [
      state('unselected', style({
        width: "100%",
        borderRight: "2px solid rgba(192, 192, 192, 0.658)",
      })),
      state('selected', style({
        width: "270%",
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
            borderRight: "100px solid #121212",
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
  @Output() select = new EventEmitter<bookSelectedAnimationEvent>();
  @HostBinding("class.selected") classSelected: boolean = false;
  constructor(private changeDetector: ChangeDetectorRef) { }
  public animationsState: string = "unselected";
  public title: string = "";
  public author: string = "";
  public written: string = "";
  public pages: number = 0;


  public onClick(): void {
    this.select.emit({ item: this.props.bookData, animationFinished: false });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const { selected } = changes.props.currentValue;
    this.classSelected = selected;

    this.title = this.bookTitle;
    this.author = this.bookAuthor;
    this.written = this.bookWritten;
    this.pages = this.bookPages;
  }

  public onAnimationEnd(ev: AnimationEvent): void {
    //fix animation
    console.log("fired", ev);
    if (ev.toState === "selected" || ev.toState === "unselected") {
      this.animationsState = ev.toState;
      this.changeDetector.detectChanges();
    }
  }

  private get bookTitle(): string {
    const { title } = this.props.bookData;
    const first = title.charAt(0).toUpperCase();
    const rest = title.slice(1);
    return first + rest;
  }

  private get bookAuthor(): string {
    return getFullName(this.props.bookData.author);
  }

  private get bookPages(): number {
    return this.props.bookData.pages;
  }

  private get bookWritten(): string {
    const { written } = this.props.bookData;
    const postfix: string = written.includes("-") ? "годах" : "году";
    return `в ${written}  ${postfix}`;
  }
}
