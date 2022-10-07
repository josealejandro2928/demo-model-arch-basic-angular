import { Box, Line } from '../library/element';

export interface ElementComponent {
  id: string;
  name: string;
  type: string;
  uxElement: Box;
  connections: Array<ConnectionComponent>;
  parentInstantiationEl: ElementComponent | null;
  isRa: boolean;
  valid: boolean;
}

export interface ConnectionComponent {
  id: string;
  name: string;
  type: string;
  uxElement: Line;
  block1: ElementComponent;
  block2: ElementComponent;
  isRa: boolean;
  valid: boolean;
}
