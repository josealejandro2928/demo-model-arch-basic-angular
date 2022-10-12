import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppStateService } from 'src/services/app-state.service';
import { delay_ms } from 'src/utils';
import {
  ConnectionComponent,
  ElementComponent,
  SADesign,
  RADesign,
} from '../../models/app.model';
import { SelectRaDesign } from '../../dialogs/select-ra-design/select-ra-design.component';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Box, Line } from 'src/library/element';
import {
  DialogAddElementComponent,
  FormCreateRAElemet,
} from 'src/dialogs/dialog-add-element/dialog-add-element.component';
import { DialogSaveRADesign } from 'src/dialogs/dialog-save-ra-design/dialog-save-ra-design.component';
import { ISuggestionItem } from '../suggestions/suggestions.component';
import { ValidationService } from 'src/services/validation.service';
@Component({
  selector: 'app-create-sa-arch',
  templateUrl: './create-sa-arch.component.html',
  styleUrls: ['./create-sa-arch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateSaArchComponent implements OnInit {
  designName = 'Example SA';
  description = '';
  id = '';
  loading = true;
  currentSADesign: SADesign | undefined;
  parentRADesign: RADesign | null = null;
  allElements: Array<ElementComponent> = [];
  allConnections: Array<ConnectionComponent> = [];
  selectionElements: Set<ElementComponent> = new Set<ElementComponent>();
  selectionConnections: Set<ConnectionComponent> =
    new Set<ConnectionComponent>();
  posX = 10;
  posY = 10;
  valid = false;
  rootDesign: HTMLElement | null = null;
  fullScreenMode = false;
  printState = false;
  constructor(
    private appStateService: AppStateService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private validationService: ValidationService
  ) {}

  ngOnInit(): void {
    this.id = this.appStateService.createUniqueId();
    this.rootDesign = document.querySelector('#box-cont');
    this.init();
  }

  async init() {
    this.route.queryParams.subscribe(
      async (data: { modal?: boolean; raId?: string }) => {
        if (data.raId) {
          let allRa: Array<RADesign> = await firstValueFrom(
            this.appStateService.getAllRA()
          );
          this.parentRADesign = allRa.find(
            (e) => (e.id = data.raId as string)
          ) as any;
        }
        if (data.modal) {
          this.openModalSelectRA();
        }
      }
    );
    await delay_ms(1000);
    this.rootDesign = document.querySelector('#box-cont');
    this.currentSADesign = this.appStateService.getCurrentSADesign();
    if (this.currentSADesign) {
      this.initCurrentSADesign(this.currentSADesign);
      this.appStateService.setNewConsoleItem(
        `Current SA design loaded: ${this.currentSADesign.name}`
      );
    }
    this.loading = false;
    this.validationService.$getNewValidations.next({
      raDesign: this.parentRADesign,
      saDesign: this.getSADesign(),
    });
    this.cdRef.markForCheck();
  }

  initCurrentSADesign(saDesign?: SADesign | undefined) {
    if (!saDesign) return;
    try {
      this.id = saDesign.id;
      this.designName = saDesign.name;
      this.description = saDesign.description as string;
      /////// Get the most updated version of the RA design ////////
      if (saDesign.parentRADesign) {
        saDesign.parentRADesign = this.appStateService.getRA(
          saDesign.parentRADesign
        );
      }
      this.parentRADesign = saDesign.parentRADesign as RADesign;
      /////////////ELEMENTS////////////////////////
      for (let el of saDesign.elements) {
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
      for (let conn of saDesign.connections) {
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

  onAddNewElement() {
    const dialogRef = this.dialog.open(DialogAddElementComponent, {
      maxHeight: '90vh',
      maxWidth: '100%',
      width: '15cm',
      data: {
        allElements: this.allElements,
        parentRADesign: this.parentRADesign,
        saDesignMode: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.createNewElement(result);
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
      isRa: true,
      valid: true,
    };
    this.allElements.push(newElement);
    this.appStateService.setNewConsoleItem(
      `Create new element id: ${newElement.id}, name: ${newElement.name}, type: ${newElement.type}`
    );
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
        parentRADesign: this.parentRADesign,
        saDesignMode: true,
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
        this.appStateService.setNewConsoleItem(
          `Edit element id: ${element.id}, name: ${element.name},
          type: ${element.type}, fill: ${element.uxElement?.options.color}, color: ${element.uxElement?.options.fontColor}`
        );
      });
  }

  onNameChanged(name: string) {
    this.appStateService.setNewConsoleItem(
      `Name changed from: ${this.designName} to: ${name}`
    );
    this.designName = name;
    this.saveDesignLocalStore();
  }

  onMoveChanged = (block: Box) => {
    Line.updateConnectionsPositions(
      this.allConnections.map((c) => c.uxElement as Line)
    );
    this.saveDesignLocalStore(false);
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
    this.cdRef.markForCheck();
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
    this.cdRef.markForCheck();
  };

  onDeleteElements = () => {
    for (let el of [...this.selectionElements]) {
      el?.uxElement?.delete();
      this.onDeleteConnections(el.connections);
      this.appStateService.setNewConsoleItem(
        `Delete element id: ${el.id}, type: ${el.type}`
      );
    }
    this.allElements = this.allElements.filter(
      (el) => !this.selectionElements.has(el)
    );
    this.selectionElements = new Set();
    this.saveDesignLocalStore();
  };

  onDeleteDesign() {
    this.allConnections.map((el) => this.selectionConnections.add(el));
    this.allElements.map((el) => this.selectionElements.add(el));
    this.onDeleteConnections(this.allConnections);
    this.onDeleteElements();
    localStorage.setItem('current-sa-design', '');
    // localStorage.setItem('current-sa-design', '');
    this.parentRADesign = null;
    this.id = this.appStateService.createUniqueId();
    this.designName = 'Example';
    this.description = '';
    this.validationService.$getNewValidations.next({});
  }

  onDeleteConnections(listConnections: Array<ConnectionComponent>) {
    for (let co of listConnections) {
      co.uxElement?.delete();
      co.block1.connections = co.block1.connections.filter((cx) => cx != co);
      co.block2.connections = co.block2.connections.filter((cx) => cx != co);
      this.appStateService.setNewConsoleItem(
        `Delete connection id: ${co.id}, type: ${co.type}`
      );
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
    this.appStateService.setNewConsoleItem(
      `Create new connection id: ${newConnection.id}, block1: ${newConnection.block1.name} and block2: ${newConnection.block2.name} `
    );
    return newConnection;
  }

  onClickRootDesign(event: any) {
    event.stopPropagation();
    for (let el of [...this.selectionConnections, ...this.selectionElements]) {
      el.uxElement?.unSelect();
    }
    this.selectionConnections = new Set();
    this.selectionElements = new Set();
  }

  onSelectRA() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        modal: true,
      },
      queryParamsHandling: 'merge',
    });
  }

  openModalSelectRA() {
    // console.log(this.parentRADesign);
    const dialogRef = this.dialog.open(SelectRaDesign, {
      maxHeight: '90vh',
      maxWidth: '100%',
      width: '20cm',
      data: this.parentRADesign,
    });
    dialogRef.afterClosed().subscribe((value: RADesign | undefined) => {
      if (!value) {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {},
        });
        return;
      }

      this.parentRADesign = value;
      this.appStateService.setNewConsoleItem(
        ` New Reference Architecture loaded: ${this.parentRADesign.name}`
      );
      this.saveDesignLocalStore();
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {},
      });
    });
  }

  getSADesign() {
    let saDesign: SADesign = {
      name: this.designName,
      description: this.description,
      id: this.id,
      connections: this.allConnections,
      elements: this.allElements,
      valid: this.valid,
      parentRADesign: this.parentRADesign as RADesign,
    };
    return saDesign;
  }

  saveDesignLocalStore(reportUpdate = true) {
    let currentDesign = this.getSADesign();
    if (reportUpdate) {
      this.validationService.$getNewValidations.next({
        raDesign: this.parentRADesign,
        saDesign: currentDesign,
      });
    }
    return this.appStateService.saveCurrentDesign(currentDesign);
  }

  onExceSuggestion(sugg: ISuggestionItem) {
    if (sugg.action == 'CONNECT') {
      const [block1Id, block2Id] = sugg.objectsIds;
      let block1 = this.allElements.find((e) => e.id == block1Id);
      let block2 = this.allElements.find((e) => e.id == block2Id);
      if (block1 && block2) {
        this.onConnectTwoElements({ block1, block2 });
      }
      this.saveDesignLocalStore();
      return;
    }
    if (sugg.action == 'CREATE') {
      let type = sugg.id.split('CREATE-').at(-1);
      this.createNewElement({
        type: type as string,
        name: type as string,
        color: '#000',
        fill: '#fff9c4',
        icon: 'code',
      });
      this.saveDesignLocalStore();
      return;
    }
    if (sugg.action == 'DISCONNECT') {
      const [connId] = sugg.objectsIds;
      this.onDeleteConnections(
        this.allConnections.filter((cc) => cc.id == connId)
      );
      this.saveDesignLocalStore();
      return;
    }
  }

  async onOpenFullScreen() {
    let pageGrid = document.querySelector('.page-grid');
    if (!pageGrid) return;
    if (this.fullScreenMode) {
      this.fullScreenMode = false;
      window.document.exitFullscreen();
    } else {
      await pageGrid?.requestFullscreen();
      this.fullScreenMode = true;
    }
  }

  onPrint(e: any) {}

  onSaveDesign() {
    const dialogRef = this.dialog.open(DialogSaveRADesign, {
      maxHeight: '90vh',
      maxWidth: '100%',
      width: '15cm',
      data: {
        element: this.saveDesignLocalStore(),
        raDesign: this.parentRADesign,
        saDesign: this.getSADesign(),
        isSADesign: true,
      },
    });

    dialogRef.afterClosed().subscribe((result: RADesign) => {
      if (!result) return;
      this.description = result.description as string;
      this.saveDesignLocalStore();
      this.appStateService.saveSA(result);
      this.onDeleteDesign();
      this.router.navigate(['index']);
    });
  }
}
