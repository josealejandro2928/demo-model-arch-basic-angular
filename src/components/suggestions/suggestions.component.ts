import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import {
  ConnectionComponent,
  ElementComponent,
  RADesign,
  SADesign,
} from 'src/models/app.model';

export interface ISuggestionItem {
  action: 'CREATE' | 'DELETE' | 'CONNECT';
  elementType: 'ElementComponent' | 'ConnectionComponent';
  message: string;
  objectsIds: string[];
  id: string;
}

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggestionsComponent implements OnInit {
  raDesign: RADesign | undefined = undefined;
  saDesign: SADesign | undefined = undefined;
  @Input() set _raDesign(value: RADesign | undefined) {
    this.raDesign = value;
    if (this.raDesign?.id == value?.id) this.allSuggestion = [];
    this.makeSuggestions(this.raDesign, this.saDesign);
  }
  @Input() set _saDesign(value: SADesign | undefined) {
    this.saDesign = value;
    this.makeSuggestions(this.raDesign, this.saDesign);
  }
  allSuggestion: Array<ISuggestionItem> = [];

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {}

  makeSuggestions(
    raDesign: RADesign | undefined,
    saDesign: SADesign | undefined
  ) {
    if (!raDesign) {
      this.allSuggestion = [];
      return;
    }
    if (!saDesign) {
      this.allSuggestion = [];
      return;
    }
    this.makeSuggestionOfCreation(raDesign, saDesign);
    // console.log('this.allSuggestion', this.allSuggestion);
  }
  makeSuggestionOfCreation(
    raDesign: RADesign | undefined,
    saDesign: SADesign | undefined
  ) {
    for (let raSingleElement of raDesign?.elements || []) {
      let saSingleElement: ElementComponent | undefined | null;
      saSingleElement = saDesign?.elements.find(
        (saEl) => saEl.type == raSingleElement.type
      );
      if (
        !saSingleElement &&
        !this.allSuggestion.find((e) => e.id.includes(raSingleElement.type))
      ) {
        let newSuggestion: ISuggestionItem = {
          action: 'CREATE',
          elementType: 'ElementComponent',
          objectsIds: [],
          message: `This current SA design should instantiate an Element with the type: <strong>${raSingleElement.type}</strong>`,
          id: `CREATE-${raSingleElement.type}`,
        };
        this.allSuggestion.push(newSuggestion);
      }
    }
  }
}
