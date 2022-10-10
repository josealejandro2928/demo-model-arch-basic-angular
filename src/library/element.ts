import interact from 'interactjs';

export interface IBoxOptions {
  name?: string;
  stroke?: string;
  color?: string;
  fontColor?: string;
  renderEL?: string;
  id?: string;
}
class Box {
  id: string = '';
  rootEl: any = null;
  options: IBoxOptions = {};
  connections: any[] = [];
  boxEl: any = null;
  labelEL: any = null;
  events: any = {};
  posX: number;
  posY: number;
  selected: boolean;
  meta: any = null;
  textEl: any = null;
  constructor(
    rootEl: any,
    options: IBoxOptions,
    events = {
      nameChange: (box: Box) => {},
      moveChange: (box: Box) => {},
      selectionChange: (box: Box, status: boolean) => {},
      contextMenu: (box: Box) => {},
    },
    meta = null
  ) {
    if (!rootEl) this.rootEl = document.querySelector('#root-el');
    else {
      this.rootEl = rootEl;
    }
    this.options = this.parserOptions(options);
    this.connections = [];
    this.boxEl = null;
    this.labelEL = null;
    this.id = this.createUniqueId();
    this.render();
    this.listeners();
    this.events = events;
    this.posX = 40;
    this.posY = 40;
    this.selected = false;
    this.meta = meta;
    this.textEl = null;
  }

  createUniqueId() {
    if (this.options.id) return this.options.id;
    return Math.floor(Date.now() + Math.random() * 10000000)
      .toString(16)
      .substring(4);
  }

  setId(uuid: string) {
    this.id = uuid;
    this.boxEl.setAttribute('id', `boxId-${this.id}`);
    return this;
  }

  parserOptions(options: any) {
    options = options ? options : {};
    let baseOptions = {
      name: 'component',
      stroke: '#000',
      color: '#fff9c4',
      fontColor: '#000',
      renderEL: null,
    };
    return { ...baseOptions, ...options };
  }

  render() {
    let boxEl = document.createElement('div');
    let bodyEl = document.createElement('div');
    bodyEl.className = 'body';
    let labelEL = document.createElement('div');
    labelEL.className = 'shape-box-label';
    labelEL.textContent = this.options.name as any;
    bodyEl.appendChild(labelEL);
    boxEl.appendChild(bodyEl);
    if (this.options?.renderEL) {
      let span = document.createElement('span');
      span.className = 'material-symbols-outlined box-icon';
      span.innerHTML = this.options.renderEL;
      bodyEl.appendChild(span);
    }
    boxEl.className = 'shape-box';
    boxEl.style.border = `2px solid ${this.options.stroke}`;
    boxEl.style.background = `${this.options.color}`;
    boxEl.setAttribute('id', `boxId-${this.id}`);
    boxEl.style.color = this.options.fontColor as string;
    labelEL.style.color = this.options.fontColor as string;
    labelEL.style.borderColor = this.options.fontColor as string;
    this.posX = 40;
    this.posY = 40;
    boxEl.style.transform = `translate(${this.posX}px, ${this.posY}px)`;
    labelEL.setAttribute('contenteditable', 'true');
    this.rootEl.appendChild(boxEl);
    this.boxEl = boxEl;
    this.labelEL = labelEL;
  }

  listeners() {
    interact(`#boxId-${this.id} .body`).draggable({
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: `#${this.rootEl.id}`,
        }),
      ],
      listeners: {
        move: (event) => {
          this.posX += event.dx;
          this.posY += event.dy;
          this.boxEl.style.transform = `translate(${this.posX}px, ${this.posY}px)`;
          if ('moveChange' in this.events) {
            this.events.moveChange(this);
          }
        },
      },
    });

    this.labelEL.addEventListener('input', this.inputNameHandler);
    this.boxEl.addEventListener('contextmenu', this.contextMenuHandler);
    this.boxEl.addEventListener('dblclick', this.doubleClickHandler);
    this.labelEL.addEventListener('click', (e: any) => e.stopPropagation());
    this.boxEl.addEventListener('click', (e: any) => e.stopPropagation());
  }

  ////////////////////////EVENT LISTENER HANDLERS ///////////////////////////////////////
  inputNameHandler = (e: any) => {
    if ('nameChange' in this.events) {
      this.options.name = e.target.textContent;
      this.events.nameChange(this);
      // console.log("the events", this.events)
    }
  };

  doubleClickHandler = (e: any) => {
    e.stopPropagation();
    this.toogleSelected();
  };

  contextMenuHandler = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    // this.toogleSelected();
    if ('contextMenu' in this.events) {
      this.events.contextMenu(this);
    }
  };

  clickContextMenuHandler = (e: any) => {
    e.stopPropagation();
  };

  /////////////////////////////////////////////////////////////////////////////////////
  toogleSelected() {
    if (this.selected) {
      this.selected = false;
      this.boxEl.style.border = `2px solid ${this.options.stroke}`;
      this.events.selectionChange(this, false);
    } else {
      this.selected = true;
      this.boxEl.style.border = '4px solid #66bb6a';
      this.events.selectionChange(this, true);
    }
  }

  unSelect(withEvent = false) {
    this.selected = false;
    this.boxEl.style.border = `2px solid ${this.options.stroke}`;
    if (withEvent) this.events.selectionChange(this, false);
  }

  getState() {
    let data = this.boxEl.getBoundingClientRect();
    return {
      id: this.id,
      width: data.width,
      x: data.x,
      y: data.y,
      height: data.height,
      options: this.options,
      connections: this.connections.map((e) => e.id),
      meta: this.meta,
    };
  }

  setName(name: string) {
    this.options.name = name;
    this.labelEL.textContent = name;
    return this;
  }

  setMeta(meta: any) {
    this.meta = meta;
    return this;
  }

  setRectData(x = 0, y = 0, w = 100, h = 100, offsetParent = true) {
    let { x: parentX, y: parentY } = this.rootEl.getBoundingClientRect();
    this.posX = x;
    this.posY = y;
    if (offsetParent) {
      this.posX -= parentX;
      this.posY -= parentY;
    }
    // debugger
    this.boxEl.style.width = `${w}px`;
    this.boxEl.style.height = `${h}px`;
    this.boxEl.style.transform = `translate(${this.posX}px, ${this.posY}px)`;
    return this;
  }

  setColor(
    color: any = '#fff9c4',
    stroke: any = '#000',
    fontColor: any = '#000'
  ) {
    if (color) {
      this.options.color = color;
      this.boxEl.style.background = color;
    }
    if (stroke) {
      this.options.stroke = stroke;
      this.boxEl.style.borderColor = stroke;
    }
    if (fontColor) {
      this.options.fontColor = fontColor;
      this.boxEl.style.color = fontColor;
      this.labelEL.style.color = fontColor;
      this.labelEL.style.borderColor = fontColor;
    }
    return this;
  }
  setIcon(icon: any) {
    this.options.renderEL = icon;
    let span = this.boxEl.querySelector('.body .box-icon');
    if (span) {
      span.innerHTML = icon;
    } else {
      let span = document.createElement('span');
      span.className = 'material-symbols-outlined box-icon';
      span.innerHTML = this.options.renderEL as any;
      this.boxEl.querySelector('.body').appendChild(span);
    }
    return this;
  }

  getCenter(offsetToParentBox = true) {
    const { x, width, y, height } = this.getState();
    let p = {
      x: x + Math.floor(width / 2),
      y: y + Math.floor(height / 2),
    };
    if (!offsetToParentBox) {
      return p;
    } else {
      let { x: parentX, y: parentY } = this.rootEl.getBoundingClientRect();
      p.x -= parentX;
      p.y -= parentY;
      return p;
    }
  }

  delete() {
    this.labelEL.removeEventListener('input', this.inputNameHandler);
    this.boxEl.removeEventListener('contextmenu', this.contextMenuHandler);
    this.boxEl.removeEventListener('dblclick', this.doubleClickHandler);
    this.boxEl.remove();
  }

  static connectTwoBloks(block1: Box, block2: Box) {
    let p1 = block1.getCenter(true);
    let p2 = block2.getCenter(true);
    let line = new Line(block1.rootEl, p1.x, p1.y, p2.x, p2.y);
    block1.connections.push(line);
    block2.connections.push(line);
    line.setBlocks(block1, block2);
    return line;
  }
}

class Line {
  rootEl: any = null;
  svgEl: any = null;
  options: any = {};
  id: string = '';
  lineEl: any;
  textEl: any;
  width = 0;
  height = 0;
  points: Array<any> = [];
  events: any;
  block1: Box | null;
  block2: Box | null;
  meta: any = null;
  selected = false;
  g: any = null;
  constructor(
    rootEl: any,
    x1 = 0,
    y1 = 0,
    x2 = 5,
    y2 = 5,
    options = {},
    events = {
      selectionChange: (line: Line) => {},
    },
    meta = null
  ) {
    if (!rootEl) this.rootEl = document.querySelector('#root-el');
    else {
      this.rootEl = rootEl;
    }
    this.svgEl = document.querySelector('#_svg');
    if (!this.svgEl) throw new Error("There should be an svg with id = '_svg'");
    this.options = this.parserOptions(options);
    this.id = this.createUniqueId();
    this.lineEl = null;
    this.textEl = null;
    this.width = 0;
    this.height = 0;
    this.points = [
      { x: x1, y: y1 },
      { x: x2, y: y2 },
    ];
    this.render();
    this.events = events;
    this.block1 = null;
    this.block2 = null;
    this.meta = meta;
    this.selected = false;
    this.listeners();
  }

  createUniqueId() {
    if (this.options.id) return this.options.id;
    return Math.floor(Date.now() + Math.random() * 10000000)
      .toString(16)
      .substring(4);
  }

  setId(uuid: string) {
    this.id = uuid;
    this.lineEl.setAttribute('id', `lineId-${this.id}`);
    return this;
  }

  parserOptions(options: any) {
    options = options ? options : {};
    let baseOptions = {
      color: '#222222',
      name: 'connections',
    };
    return { ...baseOptions, ...options };
  }

  render() {
    this.lineEl = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'polyline'
    );
    this.g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.lineEl.setAttribute(
      'points',
      this.points.map((el) => `${el.x},${el.y}`).join(' ')
    );
    this.lineEl.setAttribute('stroke', this.options.color);
    this.lineEl.setAttribute('stroke-width', 3);
    this.lineEl.setAttribute('fill', 'none');
    this.g.appendChild(this.lineEl);
    this.svgEl.appendChild(this.g);
    this.lineEl.setAttribute('id', `lineId-${this.id}`);
    // this.renderText()
  }

  renderText() {
    //////////////////Creating a text el //////////////////////////////////////
    if (this.textEl) {
      this.textEl.remove();
    }
    this.textEl = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'text'
    );
    this.textEl.textContent = this.options.name;
    let x = Math.floor((this.points[0].x + this.points.at(-1).x) / 2);
    let y = Math.floor((this.points[0].y + this.points.at(-1).y) / 2) - 10;
    let hypo = Math.sqrt(
      this.points[0].x * this.points.at(-1).x +
        this.points[0].y * this.points.at(-1).y
    );
    let cat = this.points.at(-1).y - this.points[0].y;
    let rotdeg = Math.floor((180 * Math.asin(cat / hypo)) / Math.PI);
    this.textEl.setAttribute('x', x);
    this.textEl.setAttribute('y', y);
    this.textEl.setAttribute('id', `textId-${this.id}`);
    this.g.appendChild(this.textEl);
    this.textEl.style.transformOrigin = 'center';
    this.textEl.style.transform = `rotate(${rotdeg}deg)`;
    /////////////////////////////////////////////////////////////////////////
  }

  ////////////////////////EVENT LISTENER HANDLERS ///////////////////////////////////////
  listeners() {
    this.lineEl.addEventListener('click', this.doubleClickHandler);
    // this.g.addEventListener("dblclick", this.doubleClickHandler)
  }

  doubleClickHandler = (e: any) => {
    e.stopPropagation();
    this.toogleSelected();
  };

  //////////////////////////////////////////////////////////////////////////////////////

  toogleSelected() {
    if (this.selected) {
      this.selected = false;
      this.lineEl.setAttribute('stroke-width', 3);
      this.lineEl.setAttribute('stroke', this.options.color);
      this.lineEl.style.stroke = this.options.color;
      this.events.selectionChange(this, false);
    } else {
      this.selected = true;
      this.lineEl.setAttribute('stroke-width', 5);
      this.lineEl.style.stroke = '#66bb6a';
      this.events.selectionChange(this, true);
    }
  }

  unSelect(withEvent = false) {
    this.selected = false;
    this.lineEl.setAttribute('stroke-width', 3);
    this.lineEl.setAttribute('stroke', this.options.color);
    this.lineEl.style.stroke = this.options.color;
    if (withEvent) this.events.selectionChange(this, false);
  }

  setColor(color = 'black') {
    this.options.color = color;
    this.lineEl.setAttribute('stroke', color);
    return this;
  }

  setBlocks(block1: Box, block2: Box) {
    this.block1 = block1;
    this.block2 = block2;
    return this;
  }
  setName(name: string) {
    this.options.name = name;
    return this;
  }

  setMeta(meta: any) {
    this.meta = meta;
    return this;
  }

  setPoints(arr: any[] = []) {
    this.points = arr;
    this.lineEl.setAttribute(
      'points',
      this.points.map((el) => `${el.x},${el.y}`).join(' ')
    );
    return this;
  }
  setEvent(key: string, fn: any = () => {}) {
    if (this.events) {
      this.events[key] = fn;
    } else {
      this.events = { [key]: fn };
    }
  }

  getState() {
    let data = this.lineEl.getBoundingClientRect();
    return {
      id: this.id,
      width: data.width,
      x: data.x,
      y: data.y,
      height: data.height,
      options: this.options,
      block1Id: this.block1?.id,
      block2Id: this.block2?.id,
      points: this.points,
      meta: this.meta,
    };
  }

  delete() {
    if (!this.block1 || !this.block2) return;
    this.block1.connections = this.block1?.connections.filter(
      (e) => e != this
    ) as any[];
    this.block2.connections = this.block2?.connections.filter(
      (e) => e != this
    ) as any[];
    this.lineEl.removeEventListener('dblclick', this.doubleClickHandler);
    this.lineEl.remove();
  }

  static updateConnectionsPositions(lines: Array<Line> | Line) {
    if (!(lines instanceof Array)) {
      lines = [lines];
    }
    for (let line of lines) {
      let block1 = line.block1;
      let block2 = line.block2;
      let p1 = block1?.getCenter(true);
      let p2 = block2?.getCenter(true);
      line.setPoints([p1, p2]);
      // line.renderText();
    }
  }
}

export { Box, Line };
