import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Shelf, bookSelectedEvent } from "../../types";

@Component({
  selector: 'app-shelf',
  templateUrl: './shelf.component.html',
  styleUrls: ['./shelf.component.css']
})
export class ShelfComponent {
  @Input() props: {
    books: Shelf;
    selectedBookId: string;
  }
  @Output() bookSelected: EventEmitter<bookSelectedEvent> = new EventEmitter<bookSelectedEvent>();
  public isSelected(id: string): boolean {
    return id === this.props.selectedBookId;
  }
  onSelect(event: bookSelectedEvent): void {
    this.bookSelected.emit(event);
  }
}
