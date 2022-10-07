import { Box, Line } from '../library/element';

export interface ElementComponent {
  id: string;
  name: string;
  type: string;
  uxElement: Box | string;
  connections: Array<ConnectionComponent>;
  parentInstantiationEl: ElementComponent | null;
  isRa: boolean;
}

export interface ConnectionComponent {
  id: string;
  name: string;
  type: string;
  uxElement: Line | String;
  block1: ElementComponent;
  block2: ElementComponent;
  isRa: boolean;
}
