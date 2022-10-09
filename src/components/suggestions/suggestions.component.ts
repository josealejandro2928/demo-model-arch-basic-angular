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
    this.cdRef.markForCheck();
  }
  @Input() set _saDesign(value: SADesign | undefined) {
    // console.log("Enter here: ",value);
    this.saDesign = { ...value } as any;
    this.makeSuggestions(this.raDesign, this.saDesign);
    this.cdRef.markForCheck();
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
    // console.log('Enter here');
    for (let raSingleElement of raDesign?.elements || []) {
      let saSingleElement: ElementComponent | undefined | null;
      saSingleElement = saDesign?.elements.find(
        (saEl) => saEl.type == raSingleElement.type
      );

      if (!saSingleElement) {
        let isPresent =
          this.allSuggestion.find((e) => e.id.includes(raSingleElement.type)) !=
          undefined;
        if (isPresent) return;
        let newSuggestion: ISuggestionItem = {
          action: 'CREATE',
          elementType: 'ElementComponent',
          objectsIds: [],
          message: `This current SA design should instantiate an Element with the type: <strong>${raSingleElement.type}</strong>`,
          id: `CREATE-${raSingleElement.type}`,
        };
        this.allSuggestion.push(newSuggestion);
      } else {
        this.allSuggestion = this.allSuggestion.filter((su)=>(!su.id.includes(saSingleElement?.type as string)));
      }
    }
  }
}
