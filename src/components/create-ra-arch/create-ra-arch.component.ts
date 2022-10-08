import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AppStateService } from 'src/app-state.service';
import { Box, Line } from 'src/library/element';
import {
  DialogAddElementComponent,
  FormCreateRAElemet,
} from '../../dialogs/dialog-add-element/dialog-add-element.component';
import { ConnectionComponent, ElementComponent } from '../../models/app.model';

@Component({
  selector: 'app-create-ra-arch',
  templateUrl: './create-ra-arch.component.html',
  styleUrls: ['./create-ra-arch.component.scss'],
})
export class CreateRaArchComponent implements OnInit, OnDestroy {
  designName = 'Example';
  allElements: Array<ElementComponent> = [];
  allConnections: Array<ConnectionComponent> = [];
  selectionElements: Set<ElementComponent> = new Set<ElementComponent>();
  selectionConnections: Set<ConnectionComponent> =
    new Set<ConnectionComponent>();
  posX = 10;
  posY = 10;

  @ViewChild('rootDesign', { static: false }) rootDesign: any;

  constructor(
    public dialog: MatDialog,
    private appStateService: AppStateService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.appStateService.saveCurrentDesign({
      name: this.designName,
      id: this.appStateService.createUniqueId(),
      connections: this.allConnections,
      elements: this.allElements,
      valid: false,
    });
  }

  onNameChanged(name: string) {
    this.designName = name;
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
        element.uxElement
          .setColor(result.fill, null, result.color)
          .setIcon(result.icon)
          .setName(result.name);
      });
  }

  createNewElement(data: FormCreateRAElemet) {
    let box = new Box(
      this.rootDesign.nativeElement,
      {
        name: data.name,
        color: data.fill as string,
        fontColor: data.color,
        renderEL: data.icon as string,
      },
      {
        moveChange: this.onMoveChanged,
        nameChange: this.onNameChage,
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

  onNameChage = (block: Box) => {};

  onMoveChanged = (block: Box) => {
    Line.updateConnectionsPositions(
      this.allConnections.map((c) => c.uxElement)
    );
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
      el.uxElement.delete();
      this.onDeleteConnections(el.connections);
    }
    this.allElements = this.allElements.filter(
      (el) => !this.selectionElements.has(el)
    );
    this.selectionElements = new Set();
  };

  onDeleteConnections(listConnections: Array<ConnectionComponent>) {
    for (let co of listConnections) {
      co.uxElement.delete();
      co.block1.connections = co.block1.connections.filter((cx) => cx != co);
      co.block2.connections = co.block2.connections.filter((cx) => cx != co);
    }
    this.allConnections = this.allConnections.filter(
      (el) => !listConnections.includes(el)
    );
    this.selectionConnections = new Set();
  }

  onConnectTwoElements(data: {
    block1: ElementComponent;
    block2: ElementComponent;
  }) {
    const { block1, block2 } = data;
    let line = Box.connectTwoBloks(block1.uxElement, block2.uxElement);
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
    block1.uxElement.toogleSelected();
    block2.uxElement.toogleSelected();
  }

  onSaveDesign() {
    this.appStateService.saveCurrentDesign({
      name: this.designName,
      id: this.appStateService.createUniqueId(),
      connections: this.allConnections,
      elements: this.allElements,
      valid: false,
    });
  }

  onClickRootDesign(event: any) {
    // console.log('enter here');
    event.stopPropagation();
    for (let el of [...this.selectionConnections, ...this.selectionElements]) {
      el.uxElement.unSelect();
    }
    this.selectionConnections = new Set();
    this.selectionElements = new Set();
  }
}
