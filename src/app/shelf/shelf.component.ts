import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Book, bookSelectedEvent } from "../../types";

@Component({
  selector: 'app-shelf',
  templateUrl: './shelf.component.html',
  styleUrls: ['./shelf.component.css']
})
export class ShelfComponent {
  @Input() books: Book[] = [];
  @Output() bookSelected: EventEmitter<bookSelectedEvent> = new EventEmitter<bookSelectedEvent>();
  private selectedBookId: string;
  public isSelected(id: string): boolean {
    return id === this.selectedBookId;
  }
  onSelect(event: bookSelectedEvent): void {
    this.selectedBookId = event.item.id;
    this.bookSelected.emit(event);
  }
}
