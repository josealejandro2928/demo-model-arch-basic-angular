import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  name: string = '';
  @Input() set _name(name: string) {
    this.name = name;
  }
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() title: string = 'Nothing';
  @Output() nameChanged = new EventEmitter();

  constructor() {}

  onChange(e: any) {
    this.nameChanged.next(e.target.value);
  }

  ngOnInit(): void {}
}
