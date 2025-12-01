/**
 * State Management Types
 * Types for RekaJS state, global variables, and component state
 */

export type VariableType = 'string' | 'number' | 'boolean' | 'object' | 'array';

export type GlobalVariable = {
  id: string;
  name: string;
  type: VariableType;
  value: unknown;
  defaultValue?: unknown;
};

export type ComponentStateVariable = {
  id: string;
  name: string;
  type: VariableType;
  initialValue: unknown;
  // RekaJS Val statement ID
  valId?: string;
};

export type ComponentProps = {
  [key: string]: unknown;
};

export type RekaState = {
  globalVariables: GlobalVariable[];
  componentState: ComponentStateVariable[];
  componentProps: ComponentProps;
  templateElements: string[]; // Template element IDs
};

export type ProjectState = {
  id: string | null;
  name: string;
  isDraft: boolean;
  isDirty: boolean; // Has unsaved changes
  lastSavedAt: Date | null;
  craftJson: unknown | null;
  rekaJson: unknown | null;
};

export type HistoryState = {
  past: unknown[];
  present: unknown;
  future: unknown[];
  canUndo: boolean;
  canRedo: boolean;
};

