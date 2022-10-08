import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Route, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AppStateService } from 'src/app-state.service';
import { Box, Line } from 'src/library/element';
import { delay_ms } from 'src/utils';
import {
  DialogAddElementComponent,
  FormCreateRAElemet,
} from '../../dialogs/dialog-add-element/dialog-add-element.component';
import {
  ConnectionComponent,
  ElementComponent,
  RADesign,
} from '../../models/app.model';
import { DialogSaveRADesign } from 'src/dialogs/dialog-save-ra-design/dialog-save-ra-design.component';

@Component({
  selector: 'app-create-ra-arch',
  templateUrl: './create-ra-arch.component.html',
  styleUrls: ['./create-ra-arch.component.scss'],
})
export class CreateRaArchComponent implements OnInit, OnDestroy {
  designName = 'Example';
  description = '';
  id = '';
  loading = true;
  allElements: Array<ElementComponent> = [];
  allConnections: Array<ConnectionComponent> = [];
  selectionElements: Set<ElementComponent> = new Set<ElementComponent>();
  selectionConnections: Set<ConnectionComponent> =
    new Set<ConnectionComponent>();
  posX = 10;
  posY = 10;
  currentRADesign: any;
  rootDesign: HTMLElement | null = null;

  constructor(
    public dialog: MatDialog,
    private appStateService: AppStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.appStateService.createUniqueId();
    this.rootDesign = document.querySelector('#box-cont');
    this.init();
  }

  async init() {
    await delay_ms(1000);
    this.rootDesign = document.querySelector('#box-cont');
    this.currentRADesign = this.appStateService.getCurrentRADesign();
    if (!this.currentRADesign) {
      this.loading = false;
      return;
    }
    this.initCurrentRaDesign(this.currentRADesign);
    this.loading = false;
  }

  ngOnDestroy(): void {}

  onNameChanged(name: string) {
    this.designName = name;
    this.saveDesignLocalStore();
  }

  onAddNewElement() {
    const dialogRef = this.dialog.open(DialogAddElementComponent, {
      maxHeight: '90vh',
      maxWidth: '100%',
      width: '15cm',
      data: {
        allElements: this.allElements,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.createNewElement(result);
      this.saveDesignLocalStore();
    });
  }

  onEditElement(selectedEl?: ElementComponent | undefined) {
    selectedEl = selectedEl ? selectedEl : [...this.selectionElements][0];

    const dialogRef = this.dialog.open(DialogAddElementComponent, {
      maxHeight: '90vh',
      maxWidth: '100%',
      width: '15cm',
      data: {
        allElements: this.allElements,
        element: selectedEl,
        isEdition: true,
      },
    });

    dialogRef
      .afterClosed()
      .subscribe((result: FormCreateRAElemet | undefined) => {
        if (!result) return;
        let element: ElementComponent = selectedEl as ElementComponent;
        element.name = result.name;
        element.type = result.type;
        (element?.uxElement as Box)
          .setColor(result.fill, null, result.color)
          .setIcon(result.icon)
          .setName(result.name);
        this.saveDesignLocalStore();
      });
  }

  createNewElement(data: FormCreateRAElemet) {
    let box = new Box(
      this.rootDesign,
      {
        name: data.name,
        color: data.fill as string,
        fontColor: data.color,
        renderEL: data.icon as string,
      },
      {
        moveChange: this.onMoveChanged,
        nameChange: () => {},
        selectionChange: this.onSelectionElChange,
        contextMenu: this.onContextMenu,
      }
    );
    box.setRectData((this.posX += 10), (this.posY += 10), 100, 100, false);
    let newElement: ElementComponent = {
      id: box.id,
      name: data.name,
      type: data.type,
      uxElement: box,
      connections: [],
      parentInstantiationEl: null,
      isRa: true,
      valid: true,
    };
    this.allElements.push(newElement);
  }

  onMoveChanged = (block: Box) => {
    Line.updateConnectionsPositions(
      this.allConnections.map((c) => c.uxElement as Line)
    );
    this.saveDesignLocalStore();
  };

  onContextMenu = (block: Box) => {
    let el = this.allElements.find((e) => e.id == block.id);
    if (!el) return;
    this.onEditElement(el);
  };

  onSelectionElChange = (block: Box) => {
    let elementComponent: ElementComponent | undefined = this.allElements.find(
      (e) => e.id === block.id
    );
    if (!elementComponent) return;
    if (this.selectionElements.has(elementComponent)) {
      this.selectionElements.delete(elementComponent);
    } else {
      this.selectionElements.add(elementComponent);
    }
  };

  onSelectionConnectionChange = (line: Line) => {
    let connectionComponent: ConnectionComponent | undefined =
      this.allConnections.find((e) => e.id === line.id);
    if (!connectionComponent) return;

    if (this.selectionConnections.has(connectionComponent)) {
      this.selectionConnections.delete(connectionComponent);
    } else {
      this.selectionConnections.add(connectionComponent);
    }
  };

  onDeleteElements = () => {
    for (let el of [...this.selectionElements]) {
      el?.uxElement?.delete();
      this.onDeleteConnections(el.connections);
    }
    this.allElements = this.allElements.filter(
      (el) => !this.selectionElements.has(el)
    );
    this.selectionElements = new Set();
    this.saveDesignLocalStore();
  };

  onDeleteConnections(listConnections: Array<ConnectionComponent>) {
    for (let co of listConnections) {
      co.uxElement?.delete();
      co.block1.connections = co.block1.connections.filter((cx) => cx != co);
      co.block2.connections = co.block2.connections.filter((cx) => cx != co);
    }
    this.allConnections = this.allConnections.filter(
      (el) => !listConnections.includes(el)
    );
    this.selectionConnections = new Set();
    this.saveDesignLocalStore();
  }

  onConnectTwoElements(data: {
    block1: ElementComponent;
    block2: ElementComponent;
  }) {
    const { block1, block2 } = data;
    let line = Box.connectTwoBloks(
      block1.uxElement as Box,
      block2.uxElement as Box
    );
    line.setEvent('selectionChange', this.onSelectionConnectionChange);
    let newConnection: ConnectionComponent = {
      id: line.id,
      name: line.options.name,
      type: 'connection',
      uxElement: line,
      block1: block1,
      block2: block2,
      isRa: true,
      valid: true,
    };
    block1.connections.push(newConnection);
    block2.connections.push(newConnection);
    this.allConnections.push(newConnection);
    block1?.uxElement?.toogleSelected();
    block2?.uxElement?.toogleSelected();
    this.saveDesignLocalStore();
    return newConnection;
  }

  onClickRootDesign(event: any) {
    // console.log('enter here');
    event.stopPropagation();
    for (let el of [...this.selectionConnections, ...this.selectionElements]) {
      el.uxElement?.unSelect();
    }
    this.selectionConnections = new Set();
    this.selectionElements = new Set();
  }

  saveDesignLocalStore() {
    return this.appStateService.saveCurrentDesign({
      name: this.designName,
      description: this.description,
      id: this.id,
      connections: this.allConnections,
      elements: this.allElements,
      valid: false,
    });
  }

  onDeleteDesign() {
    this.allConnections.map((el) => this.selectionConnections.add(el));
    this.allElements.map((el) => this.selectionElements.add(el));
    this.onDeleteConnections(this.allConnections);
    this.onDeleteElements();
    localStorage.setItem('current-ra-design', '');
    this.id = this.appStateService.createUniqueId();
    this.designName = 'Example';
    this.description = ""
  }

  initCurrentRaDesign(raDesign: RADesign) {
    try {
      this.id = raDesign.id;
      this.designName = raDesign.name;
      this.description = raDesign.description as string;
      /////////////ELEMENTS////////////////////////
      for (let el of raDesign.elements) {
        let new_el: ElementComponent | any = {
          id: el.id,
          isRa: el.isRa,
          name: el.name,
          type: el.type,
          uxElement: null,
          connections: [],
        };
        el.uxElementState.options.id = el.id;
        let box = new Box(this.rootDesign, el.uxElementState.options, {
          moveChange: this.onMoveChanged,
          nameChange: () => {},
          selectionChange: this.onSelectionElChange,
          contextMenu: this.onContextMenu,
        });
        // debugger
        box
          .setId(el.id)
          .setRectData(
            el.uxElementState.x,
            el.uxElementState.y,
            el.uxElementState.width,
            el.uxElementState.height
          )
          .setMeta(el.uxElementState.meta);
        new_el.uxElement = box;
        this.allElements.push(new_el);
      }
      /////////////CONNECTIONS////////////////////////
      for (let conn of raDesign.connections) {
        let new_conn: any = {
          id: conn.id,
          name: conn.name,
          isRa: conn.isRa,
          type: conn.type,
          block1: null,
          block2: null,
          valid: conn.valid,
        };
        conn.uxElementState.options.id = conn.id;
        let block1 = this.allElements.find((e) => e.id == conn.block1Id);
        let block2 = this.allElements.find((e) => e.id == conn.block2Id);
        let line = Box.connectTwoBloks(
          block1?.uxElement as Box,
          block2?.uxElement as Box
        );
        line.setEvent('selectionChange', this.onSelectionConnectionChange);
        line
          .setId(conn.id)
          .setColor(conn.uxElementState.options.color)
          .setName(conn.uxElementState.options.name)
          .setMeta(conn.uxElementState.meta);
        new_conn.block1 = block1;
        new_conn.block2 = block2;
        new_conn.uxElement = line;
        block1?.connections.push(new_conn as ConnectionComponent);
        block2?.connections.push(new_conn as ConnectionComponent);
        this.allConnections.push(new_conn as ConnectionComponent);
      }
    } catch (e) {
      console.log(
        '🚀 ~ file: create-ra-arch.component.ts ~ line 249 ~ CreateRaArchComponent ~ initCurrentRaDesign ~ e',
        e
      );
    }
  }

  onSaveDesign() {
    const dialogRef = this.dialog.open(DialogSaveRADesign, {
      maxHeight: '90vh',
      maxWidth: '100%',
      width: '15cm',
      data: {
        element: this.saveDesignLocalStore(),
      },
    });

    dialogRef.afterClosed().subscribe((result: RADesign) => {
      if (!result) return;
      this.description = result.description as string;
      this.saveDesignLocalStore();
      this.appStateService.saveRA(result);
      this.onDeleteDesign();
      this.router.navigate(['']);
    });
  }
}
