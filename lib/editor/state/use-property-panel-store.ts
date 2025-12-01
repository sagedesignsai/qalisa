/**
 * Property Panel Store
 * Manages property panel state: selected element, active tab, property values
 */

import { create } from 'zustand';
import type {
  PropertyPanelState,
  PropertyPanelTab,
  VisibilityState,
  PaddingState,
  AlignmentState,
  LoopState,
  ConditionalState,
} from '../types/property.types';

const DEFAULT_VISIBILITY: VisibilityState = {
  conditional: false,
  conditionExpression: undefined,
  responsive: {
    desktop: true,
    tablet: true,
    mobile: true,
  },
  opacity: 1,
  animatedOpacity: false,
};

const DEFAULT_PADDING: PaddingState = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  unit: 'px',
};

const DEFAULT_ALIGNMENT: AlignmentState = {
  x: 'stretch',
  y: 'stretch',
};

const DEFAULT_LOOP: LoopState = {
  iteratorExpression: '',
  exposeVariables: true,
  indexVariable: false,
  variableAlias: 'item',
};

const DEFAULT_CONDITIONAL: ConditionalState = {
  conditionExpression: '',
  trueTemplateId: undefined,
  falseTemplateId: undefined,
};

const DEFAULT_STATE: PropertyPanelState = {
  selectedElementId: null,
  activeTab: 'visibility',
  visibility: DEFAULT_VISIBILITY,
  padding: DEFAULT_PADDING,
  alignment: DEFAULT_ALIGNMENT,
  loop: DEFAULT_LOOP,
  conditional: DEFAULT_CONDITIONAL,
};

interface PropertyPanelStore extends PropertyPanelState {
  // Selection actions
  setSelectedElement: (elementId: string | null) => void;
  setActiveTab: (tab: PropertyPanelTab) => void;

  // Visibility actions
  setVisibility: (visibility: Partial<VisibilityState>) => void;
  toggleConditional: () => void;
  setConditionExpression: (expression: string) => void;
  setResponsiveVisibility: (device: 'desktop' | 'tablet' | 'mobile', visible: boolean) => void;
  setOpacity: (opacity: number) => void;
  toggleAnimatedOpacity: () => void;

  // Padding actions
  setPadding: (padding: Partial<PaddingState>) => void;
  setPaddingValue: (side: 'top' | 'right' | 'bottom' | 'left', value: number) => void;
  setPaddingUnit: (unit: 'px' | 'rem' | 'em' | '%') => void;

  // Alignment actions
  setAlignment: (alignment: Partial<AlignmentState>) => void;
  setAlignmentX: (x: 'left' | 'center' | 'right' | 'stretch') => void;
  setAlignmentY: (y: 'top' | 'center' | 'bottom' | 'stretch') => void;

  // Loop actions
  setLoop: (loop: Partial<LoopState>) => void;
  setIteratorExpression: (expression: string) => void;
  toggleExposeVariables: () => void;
  toggleIndexVariable: () => void;
  setVariableAlias: (alias: string) => void;

  // Conditional actions
  setConditional: (conditional: Partial<ConditionalState>) => void;
  setConditionExpression: (expression: string) => void;

  // Reset actions
  resetProperties: () => void;
}

export const usePropertyPanelStore = create<PropertyPanelStore>((set) => ({
  // Initial state
  ...DEFAULT_STATE,

  // Selection actions
  setSelectedElement: (elementId) =>
    set({
      selectedElementId: elementId,
      // Reset properties when selecting a new element
      visibility: DEFAULT_VISIBILITY,
      padding: DEFAULT_PADDING,
      alignment: DEFAULT_ALIGNMENT,
      loop: DEFAULT_LOOP,
      conditional: DEFAULT_CONDITIONAL,
    }),

  setActiveTab: (tab) =>
    set({
      activeTab: tab,
    }),

  // Visibility actions
  setVisibility: (visibility) =>
    set((state) => ({
      visibility: {
        ...state.visibility,
        ...visibility,
      },
    })),

  toggleConditional: () =>
    set((state) => ({
      visibility: {
        ...state.visibility,
        conditional: !state.visibility.conditional,
      },
    })),

  setConditionExpression: (expression) =>
    set((state) => ({
      visibility: {
        ...state.visibility,
        conditionExpression: expression,
      },
    })),

  setResponsiveVisibility: (device, visible) =>
    set((state) => ({
      visibility: {
        ...state.visibility,
        responsive: {
          ...state.visibility.responsive,
          [device]: visible,
        },
      },
    })),

  setOpacity: (opacity) =>
    set((state) => ({
      visibility: {
        ...state.visibility,
        opacity: Math.max(0, Math.min(1, opacity)),
      },
    })),

  toggleAnimatedOpacity: () =>
    set((state) => ({
      visibility: {
        ...state.visibility,
        animatedOpacity: !state.visibility.animatedOpacity,
      },
    })),

  // Padding actions
  setPadding: (padding) =>
    set((state) => ({
      padding: {
        ...state.padding,
        ...padding,
      },
    })),

  setPaddingValue: (side, value) =>
    set((state) => ({
      padding: {
        ...state.padding,
        [side]: value,
      },
    })),

  setPaddingUnit: (unit) =>
    set((state) => ({
      padding: {
        ...state.padding,
        unit,
      },
    })),

  // Alignment actions
  setAlignment: (alignment) =>
    set((state) => ({
      alignment: {
        ...state.alignment,
        ...alignment,
      },
    })),

  setAlignmentX: (x) =>
    set((state) => ({
      alignment: {
        ...state.alignment,
        x,
      },
    })),

  setAlignmentY: (y) =>
    set((state) => ({
      alignment: {
        ...state.alignment,
        y,
      },
    })),

  // Loop actions
  setLoop: (loop) =>
    set((state) => ({
      loop: {
        ...state.loop,
        ...loop,
      },
    })),

  setIteratorExpression: (expression) =>
    set((state) => ({
      loop: {
        ...state.loop,
        iteratorExpression: expression,
      },
    })),

  toggleExposeVariables: () =>
    set((state) => ({
      loop: {
        ...state.loop,
        exposeVariables: !state.loop.exposeVariables,
      },
    })),

  toggleIndexVariable: () =>
    set((state) => ({
      loop: {
        ...state.loop,
        indexVariable: !state.loop.indexVariable,
      },
    })),

  setVariableAlias: (alias) =>
    set((state) => ({
      loop: {
        ...state.loop,
        variableAlias: alias,
      },
    })),

  // Conditional actions
  setConditional: (conditional) =>
    set((state) => ({
      conditional: {
        ...state.conditional,
        ...conditional,
      },
    })),

  setConditionExpression: (expression) =>
    set((state) => ({
      conditional: {
        ...state.conditional,
        conditionExpression: expression,
      },
    })),

  // Reset actions
  resetProperties: () =>
    set(DEFAULT_STATE),
}));

