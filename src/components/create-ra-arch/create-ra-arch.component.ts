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
    console.log('HEllo from here');
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

  createNewElement(data: FormCreateRAElemet) {
    let box = new Box(
      this.rootDesign.nativeElement,
      {
        name: data.name,
        color: data.fill,
        fontColor: data.color,
      },
      {
        moveChange: this.onMoveChanged,
        nameChange: this.onNameChage,
        selectionChange: this.onSelectionElChange,
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

  onNameChage = (block: Box) => {
    // let elementsArr = [...allElementsRef.current];
    // let index: any = elementsArr.findIndex((el) => el.id === block.id);
    // if (index === -1) return;
    // let el = { ...elementsArr[index], name: block.options.name };
    // elementsArr[index] = el;
    // setAllElements(elementsArr);
  };

  onMoveChanged = (block: Box) => {
    Line.updateConnectionsPositions(
      this.allConnections.map((c) => c.uxElement)
    );
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
}
