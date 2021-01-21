import { Component, OnInit } from '@angular/core';
import { Shelf } from "../types";
import fakeRequest from "../fakeRequest";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public data: Array<Shelf> = [];
  public get firstBook() {
    if (!this.loaded) return;
    return this.data[0][2];
  }
  public get loaded(): boolean {
    return this.data.length > 0;
  }
  public formProps = {
    title: "test form",
    fields: [
      { type: "text", name: "text1" },
      { type: "text", name: "text2" }
    ]
  }
  ngOnInit(): void {
    fakeRequest()
      .then((request: string) => {
        const result = JSON.parse(request);
        if (result) {
          this.data = result;
        } else {
          throw "Fake request failed.";
        }
      })
  }
}
