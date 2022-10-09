import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConnectionComponent, ElementComponent } from '../../models/app.model';

@Component({
  selector: 'app-modeler',
  templateUrl: './modeler.component.html',
  styleUrls: ['./modeler.component.scss'],
})
export class ModelerComponent implements OnInit {
  selectionElements: Set<ElementComponent> = new Set();
  selectionConnections: Set<ConnectionComponent> = new Set();
  allConnections: Array<ConnectionComponent> = [];
  allElements: Array<ElementComponent> = [];
  @Input() color: 'primary' | 'accent' = 'primary';
  @Input() set _selectionElements(selection: Set<ElementComponent>) {
    this.selectionElements = selection;
  }

  @Input() set _selectionConnections(selection: Set<ConnectionComponent>) {
    this.selectionConnections = selection;
  }
  @Input() set _connections(val: Array<ConnectionComponent>) {
    this.allConnections = val;
  }
  @Input() set _elements(val: Array<ElementComponent>) {
    this.allElements = val;
  }

  @Output() addNewElement = new EventEmitter();
  @Output() deleteElements = new EventEmitter();
  @Output() deleteConnections = new EventEmitter();
  @Output() saveDesign = new EventEmitter();
  @Output() editElement = new EventEmitter();
  @Output() deleteDesign = new EventEmitter();
  @Output() connectTwoElements = new EventEmitter<{
    block1: ElementComponent;
    block2: ElementComponent;
  }>();

  constructor() {}

  ngOnInit(): void {}

  onConnect() {
    const [block1, block2] = [...this.selectionElements];
    this.connectTwoElements.next({ block1, block2 });
  }

  onDeleteConnections() {
    this.deleteConnections.next([...this.selectionConnections]);
  }
}
