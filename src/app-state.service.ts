import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { RADesign, ConsoleItem, SADesign } from './models/app.model';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  listRA: Array<RADesign> = [];
  listSA: Array<RADesign> = [];
  user = 'jalejandro2928-asus';
  consoleElements: Array<ConsoleItem> = [
    {
      message: 'Hello from console',
      user: this.user,
      date: new Date(),
      id: '1',
    },
  ];
  $consoleUpdate: BehaviorSubject<Array<ConsoleItem>>;

  constructor() {
    try {
      this.listRA = JSON.parse(localStorage.getItem('listRA') as any);
      this.listSA = JSON.parse(localStorage.getItem('listSA') as any);
      if (!this.listRA) {
        localStorage.setItem('listRA', '[]');
        this.listRA = [];
      }
      if (!this.listSA) {
        localStorage.setItem('listSA', '[]');
        this.listSA = [];
      }
    } catch (e) {
      localStorage.setItem('listRA', '[]');
      localStorage.setItem('listSA', '[]');
    }
    this.$consoleUpdate = new BehaviorSubject(this.consoleElements);
    // console.log(this.listRA, '*******************');
  }

  saveCurrentDesign(data: RADesign | SADesign) {
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
    if ('parentRADesign' in data) {
      localStorage.setItem('current-sa-design', JSON.stringify(data));
    } else {
      localStorage.setItem('current-ra-design', JSON.stringify(data));
    }

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

  setCurrentRADesign(data: RADesign) {
    localStorage.setItem('current-ra-design', JSON.stringify(data));
  }

  getCurrentSADesign() {
    let currentSADesign: any;
    try {
      currentSADesign = JSON.parse(
        localStorage.getItem('current-sa-design') || ''
      );
    } finally {
      return currentSADesign;
    }
  }

  createUniqueId() {
    return Math.floor(Date.now() + Math.random() * 10000000)
      .toString(16)
      .substring(4);
  }

  saveRA(element: RADesign) {
    let index = this.listRA.findIndex((e) => e.id == element.id);
    if (index > -1) {
      this.listRA[index] = element;
    } else {
      this.listRA.push(element);
    }
    localStorage.setItem('listRA', JSON.stringify(this.listRA));
  }

  getAllRA(): Observable<RADesign[]> {
    return of(this.listRA);
  }

  getAllSA(): Observable<RADesign[]> {
    return of(this.listSA);
  }

  setNewConsoleItem(message = '') {
    if (this.consoleElements.length > 20) {
      this.consoleElements = this.consoleElements.slice(1);
    }
    this.consoleElements.push({
      id: this.createUniqueId(),
      message: message,
      user: this.user,
      date: new Date(),
    });
    this.$consoleUpdate.next(this.consoleElements);
  }
}
