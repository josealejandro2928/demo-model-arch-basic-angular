import { Injectable } from '@angular/core';
import {
  ConnectionComponent,
  ElementComponent,
  RADesign,
  SADesign,
} from 'src/models/app.model';
import { ISuggestionItem } from '../components/suggestions/suggestions.component';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  constructor() {}

  makeSuggestions(
    raDesign: RADesign | undefined,
    saDesign: SADesign | undefined
  ) {
    let allSuggestion: Array<ISuggestionItem> = [];
    if (!raDesign) {
      return [];
    }
    if (!saDesign) {
      return [];
    }
    allSuggestion = this.makeSuggestionOfCreation(
      raDesign,
      saDesign,
      allSuggestion
    );
    allSuggestion = this.makeSuggestionOfConnection(
      raDesign,
      saDesign,
      allSuggestion
    );
    allSuggestion = this.makeSuggestionOfInvalidConnection(
      raDesign,
      saDesign,
      allSuggestion
    );
    return allSuggestion;
    // console.log('this.allSuggestion', this.allSuggestion);
  }

  makeSuggestionOfCreation(
    raDesign: RADesign | undefined,
    saDesign: SADesign | undefined,
    allSuggestion: Array<ISuggestionItem>
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
        allSuggestion.push(newSuggestion);
      } else {
        allSuggestion = allSuggestion.filter((su) => su.id != idSuggestion);
      }
    }
    return allSuggestion;
  }

  makeSuggestionOfConnection(
    raDesign: RADesign | undefined,
    saDesign: SADesign | undefined,
    allSuggestion: Array<ISuggestionItem>
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
      if (!(block1SAArr?.length && block2SAArr?.length)) return allSuggestion;
      /// Significa que no deberiamos sugerir conectar componentes no disenados aun
      // debugger
      for (let block1 of block1SAArr) {
        for (let block2 of block2SAArr) {
          let idSuggestion = `CONNECT-${block1.id}-${block2.id}`;
          let connection = saDesign?.connections.find(
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
            allSuggestion.push(newSuggestion);
          } else {
            allSuggestion = allSuggestion.filter((s) => s.id != idSuggestion);
          }
        }
      }
    }
    return allSuggestion;
  }

  makeSuggestionOfInvalidConnection(
    raDesign: RADesign | undefined,
    saDesign: SADesign | undefined,
    allSuggestion: Array<ISuggestionItem>
  ) {
    // console.log('Enter here');
    for (let saConnection of saDesign?.connections || []) {
      let typeEl1 = saConnection.block1.type;
      let typeEl2 = saConnection.block2.type;
      // debugger;
      if (typeEl1 == typeEl2) continue;
      let connectionOnRA: ConnectionComponent | undefined =
        raDesign?.connections.find((raC) => {
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
        allSuggestion.push(newSuggestion);
        saConnection.uxElement?.setColor('red');
      } else {
        saConnection.uxElement?.setColor('#000');
        allSuggestion = allSuggestion.filter((s) => s.id != idSuggestion);
      }
    }
    return allSuggestion;
  }
}
