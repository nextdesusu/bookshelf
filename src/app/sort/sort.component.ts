import { Component, Output, EventEmitter } from '@angular/core';
import { sortEvent, sortDirection, sorter } from "../../types";

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.css']
})
export class SortComponent {
  @Output() sort: EventEmitter<sortEvent> = new EventEmitter<sortEvent>();
  private direction: sortDirection = "ascending";
  private sortBy: sorter = "none";

  constructor() { }

  private emit(): void {
    const { direction, sortBy } = this;
    this.sort.emit({
      direction,
      sortBy,
    });
  }

  public onClick(): void {
    const newValue: sortDirection = this.direction === "ascending" ? "descending" : "ascending";
    this.direction = newValue;
    this.emit();
  }

  public get sortSign(): string {
    return this.direction === "ascending" ? "↑" : "↓";
  }

  public onChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    switch (target.value) {
      case "0":
        this.sortBy = "none";
        break;
      case "1":
        this.sortBy = "author";
        break;
      case "2":
        this.sortBy = "title";
        break;
      default:
        this.sortBy = "none";
    }
    this.emit();
  }
}
