import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AppStateService } from 'src/services/app-state.service';
import { ElementComponent } from '../../models/app.model';
import { appIcons } from 'src/utils';

@Component({
  selector: 'app-setting-element',
  templateUrl: './setting-element.component.html',
  styleUrls: ['./setting-element.component.scss'],
})
export class SettingElementComponent implements OnInit {
  component: ElementComponent | undefined | null;
  height: number | undefined;
  width: number | undefined;
  x: number | undefined;
  y: number | undefined;
  allIcons: { name: string; icon: string }[] = appIcons.sort(
    (a: any, b: any) => {
      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
      return 0;
    }
  );
  icon: string | undefined;

  @Input() set _component(value: ElementComponent | undefined | null) {
    this.component = value;
    if (this.component) {
      const { x, y, height, width } =
        this.component.uxElement?.getState() as any;
      this.height = height;
      this.width = width;
      this.x = x;
      this.y = y;
      this.icon = this.component?.uxElement?.options?.renderEL;
    } else {
      this.height = undefined;
      this.width = undefined;
      this.x = undefined;
      this.y = undefined;
      this.icon = undefined;
    }
  }
  @Output() $componentChanged: EventEmitter<ElementComponent | undefined> =
    new EventEmitter<ElementComponent | undefined>();

  constructor(private appService: AppStateService) {}

  ngOnInit(): void {}

  onChangeComponentName(name: string) {
    if (name.trim().length <= 1) {
      this.appService.setNewConsoleItem(
        `<span class="error">INVALID NAME TO ASSIGN</span>`
      );
      return;
    }
    this.appService.setNewConsoleItem(
      `Component changed the name from ${this.component?.name} to ${name}`
    );
    this.component?.uxElement?.setName(name);
    (this.component as any).name = name;
    this.$componentChanged.emit(this.component as any);
  }
  onChangeFillColor(color: string) {
    if (!color) {
      this.appService.setNewConsoleItem(
        `<span class="error">INVALID A COLOR MUST BE CHOOSEN</span>`
      );
      return;
    }
    this.component?.uxElement?.setColor(color);
    this.$componentChanged.emit(this.component as any);
  }

  onChangeColor(color: string) {
    if (!color) {
      this.appService.setNewConsoleItem(
        `<span class="error">INVALID A COLOR MUST BE CHOOSEN</span>`
      );
      return;
    }
    this.component?.uxElement?.setColor(null, null, color);
    this.$componentChanged.emit(this.component as any);
  }

  onChangeSize(data: { h?: number; w?: number }) {
    if (data.h) {
      if (!isNaN(+data.h)) {
        this.component?.uxElement?.setRectData(
          this.x,
          this.y,
          this.width,
          data.h
        );
        this.height = data.h;
        this.$componentChanged.emit(this.component as any);
      } else {
        this.appService.setNewConsoleItem(
          `<span class="error">INVALID SETTING A HEIGHT</span>`
        );
      }
    }

    if (data.w) {
      if (!isNaN(+data.w)) {
        this.component?.uxElement?.setRectData(
          this.x,
          this.y,
          data.w,
          this.height
        );
        this.width = data.w;
        this.$componentChanged.emit(this.component as any);
      } else {
        this.appService.setNewConsoleItem(
          `<span class="error">INVALID SETTING A WIDTH</span>`
        );
      }
    }
  }

  onChangePos(data: { x?: number; y?: number }) {
    if (data.x) {
      if (!isNaN(+data.x)) {
        this.component?.uxElement?.setRectData(
          data.x,
          this.y,
          this.width,
          this.height
        );
        this.component?.uxElement?.events?.moveChange(
          this.component?.uxElement
        );
        this.x = data.x;
        this.$componentChanged.emit(this.component as any);
      } else {
        this.appService.setNewConsoleItem(
          `<span class="error">INVALID SETTING A X POSITION</span>`
        );
      }
    }

    if (data.y) {
      if (!isNaN(+data.y)) {
        this.component?.uxElement?.setRectData(
          this.x,
          data.y,
          this.width,
          this.height
        );
        this.component?.uxElement?.events?.moveChange(
          this.component?.uxElement
        );
        this.y = data.y;
        this.$componentChanged.emit(this.component as any);
      } else {
        this.appService.setNewConsoleItem(
          `<span class="error">INVALID SETTING A Y POSITION</span>`
        );
      }
    }
  }
  onIconChange(data: string) {
    this.component?.uxElement?.setIcon(data);
    this.icon = data;
    this.$componentChanged.emit(this.component as any);
  }
}
