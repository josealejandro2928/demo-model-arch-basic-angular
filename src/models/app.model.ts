import { Box, Line } from '../library/element';

export interface ElementComponent {
  id: string;
  name: string;
  type: string;
  uxElement?: Box;
  uxElementState?:any;
  connections: Array<ConnectionComponent>;
  parentInstantiationEl: ElementComponent | null;
  isRa: boolean;
  valid: boolean;
}

export interface ConnectionComponent {
  id: string;
  name: string;
  type: string;
  uxElement?: Line;
  uxElementState?:any;
  block1: ElementComponent;
  block2: ElementComponent;
  block1Id?:string;
  block2Id?:string;
  isRa: boolean;
  valid: boolean;
}

export interface RADesign {
  name: string;
  id: string;
  elements: Array<ElementComponent>;
  connections: Array<ConnectionComponent>;
  valid: boolean;
  description?: string;
}
