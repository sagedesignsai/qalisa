/**
 * Property Panel Types
 * Types for property editing and property panel state
 */

export type PropertyPanelTab = 
  | 'visibility'
  | 'padding-alignment'
  | 'loop'
  | 'conditional'
  | 'classes'
  | 'props'
  | 'element-properties';

export type VisibilityState = {
  conditional: boolean;
  conditionExpression?: string;
  responsive: {
    desktop: boolean;
    tablet: boolean;
    mobile: boolean;
  };
  opacity: number;
  animatedOpacity: boolean;
};

export type PaddingState = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  unit: 'px' | 'rem' | 'em' | '%';
};

export type AlignmentState = {
  x: 'left' | 'center' | 'right' | 'stretch';
  y: 'top' | 'center' | 'bottom' | 'stretch';
};

export type LoopState = {
  iteratorExpression: string;
  exposeVariables: boolean;
  indexVariable: boolean;
  variableAlias: string; // e.g., "For post"
};

export type ConditionalState = {
  conditionExpression: string;
  trueTemplateId?: string;
  falseTemplateId?: string;
};

export type PropertyPanelState = {
  selectedElementId: string | null;
  activeTab: PropertyPanelTab;
  visibility: VisibilityState;
  padding: PaddingState;
  alignment: AlignmentState;
  loop: LoopState;
  conditional: ConditionalState;
};

