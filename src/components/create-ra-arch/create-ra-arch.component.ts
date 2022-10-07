import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Box } from 'src/library/element';
import {
  DialogAddElementComponent,
  FormCreateRAElemet,
} from '../../dialogs/dialog-add-element/dialog-add-element.component';
import { ElementComponent } from '../../models/app.model';

@Component({
  selector: 'app-create-ra-arch',
  templateUrl: './create-ra-arch.component.html',
  styleUrls: ['./create-ra-arch.component.scss'],
})
export class CreateRaArchComponent implements OnInit {
  designName = 'Example';
  allElements: Array<ElementComponent> = [];

  @ViewChild('rootDesign', { static: false }) rootDesign: any;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}
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
    box.setRectData(10, 10, 100, 100, false);
    let newElement: ElementComponent = {
      id: box.id,
      name: data.name,
      type: data.type,
      uxElement: box,
      connections: [],
      parentInstantiationEl: null,
      isRa: true,
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
    // Line.updateConnectionsPositions(allConnections);
  };

  onSelectionElChange = (block: Box) => {
    // let selectionElements: Set<ElementComponent> = selectionElementsRef.current;
    // let elementComponent: ElementComponent | undefined =
    //   allElementsRef.current.find((e) => e.id === block.id);
    // if (!elementComponent) return;
    // if (selectionElements.has(elementComponent)) {
    //   selectionElements.delete(elementComponent);
    // } else {
    //   selectionElements.add(elementComponent);
    // }
    // selectionElementsRef.current = new Set(selectionElements);
  };
}
