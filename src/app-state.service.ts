import { Injectable } from '@angular/core';
import { RADesign } from './models/app.model';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  currentRADesign: RADesign | undefined;
  allRA: any[] = [];

  constructor() {}

  saveCurrentDesign(data: RADesign) {
    let connections = data.connections.map((co) => {
      let saveCo: any = {
        id: co.id,
        name: co.name,
        uxElementState: co.uxElement?.getState(),
        block1Id: co.block1.id,
        block2Id: co.block2.id,
        type: co.type,
        isRa: co.isRa,
        valid: co.valid,
      };
      return saveCo;
    });

    let elements = data.elements.map((el) => {
      let saveEl: any = {
        id: el.id,
        name: el.name,
        type: el.type,
        uxElementState: el.uxElement?.getState(),
        isRa: el.isRa,
        valid: el.valid,
        connections: el.connections.map((c) => c.id),
      };
      return saveEl;
    });

    data = {
      ...data,
      elements,
      connections,
    };

    localStorage.setItem('current-ra-design', JSON.stringify(data));
    return data;
  }

  getCurrentRADesign() {
    let currentRADesign: any;
    try {
      currentRADesign = JSON.parse(
        localStorage.getItem('current-ra-design') || ''
      );
    } finally {
      return currentRADesign;
    }
  }

  createUniqueId() {
    return Math.floor(Date.now() + Math.random() * 10000000)
      .toString(16)
      .substring(4);
  }
}
