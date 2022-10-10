import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  ConnectionComponent,
  ElementComponent,
  RADesign,
  SADesign,
} from 'src/models/app.model';

export interface ISuggestionItem {
  action: 'CREATE' | 'DELETE' | 'CONNECT' | 'DISCONNECT';
  elementType: 'ElementComponent' | 'ConnectionComponent';
  message: string;
  objectsIds: string[];
  id: string;
  severity: 'ERROR' | 'WARNING';
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
  suggestionRejected: Set<string> | undefined = new Set();
  @Output() onAutomaticSuggestionExce: EventEmitter<ISuggestionItem> =
    new EventEmitter();

  @Input() set _raDesign(value: RADesign | undefined) {
    this.raDesign = value;
    this.allSuggestion = [];
    this.makeSuggestions(this.raDesign, this.saDesign);
    this.cdRef.markForCheck();
  }
  @Input() set _saDesign(value: SADesign | undefined) {
    // console.log("Enter here: ",value);
    this.saDesign = value;
    this.allSuggestion = [];
    this.makeSuggestions(this.raDesign, this.saDesign);
    this.getInitialSUggestionRejected();
    this.cdRef.markForCheck();
  }
  allSuggestion: Array<ISuggestionItem> = [];

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {}

  getInitialSUggestionRejected() {
    let meta: any = localStorage.getItem(this.saDesign?.id as string);
    // console.log(meta);
    if (!meta) return;
    meta = JSON.parse(meta);
    this.suggestionRejected = new Set(meta?.suggestionRejected);
    // console.log(this.suggestionRejected);
  }

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
    this.makeSuggestionOfConnection(raDesign, saDesign);
    this.makeSuggestionOfInvalidConnection(raDesign, saDesign);
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
      let idSuggestion = `CREATE-${raSingleElement.type}`;
      if (!saSingleElement) {
        let newSuggestion: ISuggestionItem = {
          action: 'CREATE',
          elementType: 'ElementComponent',
          objectsIds: [],
          message: `This current SA design should instantiate an Element with the type: <strong>${raSingleElement.type}</strong>`,
          id: idSuggestion,
          severity: 'ERROR',
        };
        this.allSuggestion.push(newSuggestion);
      } else {
        this.allSuggestion = this.allSuggestion.filter(
          (su) => su.id != idSuggestion
        );
      }
    }
  }

  makeSuggestionOfConnection(
    raDesign: RADesign | undefined,
    saDesign: SADesign | undefined
  ) {
    // console.log('Enter here');
    // debugger;
    for (let raSingleConn of raDesign?.connections || []) {
      let block1RA = raDesign?.elements.find(
        (e) => e.id == raSingleConn?.block1Id
      );
      let block2RA = raDesign?.elements.find(
        (e) => e.id == raSingleConn?.block2Id
      );
      let block1SAArr = saDesign?.elements.filter(
        (e) => e.type == block1RA?.type
      );
      let block2SAArr = saDesign?.elements.filter(
        (e) => e.type == block2RA?.type
      );
      if (!(block1SAArr?.length && block2SAArr?.length)) return;
      /// Significa que no deberiamos sugerir conectar componentes no disenados aun
      // debugger
      for (let block1 of block1SAArr) {
        for (let block2 of block2SAArr) {
          let idSuggestion = `CONNECT-${block1.id}-${block2.id}`;
          let connection = this.saDesign?.connections.find(
            (c) => c.block1.id == block1.id && c.block2.id == block2.id
          );
          if (!connection) {
            let newSuggestion: ISuggestionItem = {
              action: 'CONNECT',
              elementType: 'ConnectionComponent',
              objectsIds: [block1.id, block2.id],
              message: `There should be a <strong>connection between ${block1.name} and ${block2.name}</strong> `,
              id: idSuggestion,
              severity: 'WARNING',
            };
            this.allSuggestion.push(newSuggestion);
          } else {
            this.allSuggestion = this.allSuggestion.filter(
              (s) => s.id != idSuggestion
            );
          }
        }
      }
    }
  }

  makeSuggestionOfInvalidConnection(
    raDesign: RADesign | undefined,
    saDesign: SADesign | undefined
  ) {
    // console.log('Enter here');
    for (let saConnection of saDesign?.connections || []) {
      let typeEl1 = saConnection.block1.type;
      let typeEl2 = saConnection.block2.type;
      // debugger;
      if (typeEl1 == typeEl2) continue;
      let connectionOnRA: ConnectionComponent | undefined =
        this.raDesign?.connections.find((raC) => {
          let block1RA = raDesign?.elements.find((e) => e.id == raC?.block1Id);
          let block2RA = raDesign?.elements.find((e) => e.id == raC?.block2Id);
          if (
            (block1RA?.type == typeEl1 && block2RA?.type == typeEl2) ||
            (block1RA?.type == typeEl2 && block2RA?.type == typeEl1)
          )
            return true;
          return false;
        });
      let idSuggestion = `DISCONNECT-${saConnection.id}`;
      if (!connectionOnRA) {
        let newSuggestion: ISuggestionItem = {
          action: 'DISCONNECT',
          elementType: 'ConnectionComponent',
          objectsIds: [saConnection?.id],
          message: `Delete the connection between <strong>${saConnection.block1.name} </strong>
          and <strong>${saConnection.block2.name}</strong>, it is <strong>violating</strong> the constraint defined in the chossen RA`,
          id: idSuggestion,
          severity: 'ERROR',
        };
        this.allSuggestion.push(newSuggestion);
        saConnection.uxElement?.setColor('red');
      } else {
        this.allSuggestion = this.allSuggestion.filter(
          (s) => s.id != idSuggestion
        );
      }
    }
  }

  onReject(e: any, item: ISuggestionItem) {
    e.stopPropagation();
    this.suggestionRejected?.add(item.id);
    let data = {
      suggestionRejected: [...(this.suggestionRejected || [])],
    };
    localStorage.setItem(this.saDesign?.id as string, JSON.stringify(data));
  }

  onRestore() {
    localStorage.setItem(this.saDesign?.id as string, '');
    this.suggestionRejected = new Set();
  }

  onClickSuggestion(item: ISuggestionItem) {
    this.onAutomaticSuggestionExce.next(item);
  }
}
