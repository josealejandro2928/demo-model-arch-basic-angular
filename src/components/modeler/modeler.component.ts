import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ElementComponent } from '../../models/app.model';

@Component({
  selector: 'app-modeler',
  templateUrl: './modeler.component.html',
  styleUrls: ['./modeler.component.scss'],
})
export class ModelerComponent implements OnInit {
  selectionElements: Set<ElementComponent> = new Set();
  @Input() set _selectionElements(selection: Set<ElementComponent>) {
    this.selectionElements = selection;
  }

  @Output() addNewElement = new EventEmitter();
  @Output() deleteElements = new EventEmitter();
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
}
