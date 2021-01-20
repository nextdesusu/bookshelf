import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Book, Shelf } from "../../types";

@Component({
  selector: 'app-shelf',
  templateUrl: './shelf.component.html',
  styleUrls: ['./shelf.component.css']
})
export class ShelfComponent {
  @Input() books: Book[] = [];
}
