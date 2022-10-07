import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modeler',
  templateUrl: './modeler.component.html',
  styleUrls: ['./modeler.component.scss']
})
export class ModelerComponent implements OnInit {

  @Output() addNewEleement = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
