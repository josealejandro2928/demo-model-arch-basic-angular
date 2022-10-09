import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  ConnectionComponent,
  ElementComponent,
  RADesign,
} from 'src/models/app.model';

export interface ISuggestionItem {
  action: 'CREATE' | 'DELETE' | 'CONNECT';
  elementType: ElementComponent | ConnectionComponent;
  message: string;
  objectsIds: string[];
}

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss'],
})
export class SuggestionsComponent implements OnInit, OnChanges {
  @Input() raDesign: RADesign | undefined = undefined;
  @Input() saDesign: RADesign | undefined = undefined;
  allSuggestion: Array<SuggestionsComponent> = [];
  constructor() {}

  ngOnInit(): void {
    console.log(this.raDesign);
    console.log(this.saDesign);
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
}
