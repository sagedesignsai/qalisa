/**
 * RekaJS State Store
 * Manages RekaJS AST state: global variables, component state, props
 */

import { create } from 'zustand';
import type { RekaState, GlobalVariable, ComponentStateVariable, ComponentProps } from '../types/state.types';

const DEFAULT_STATE: RekaState = {
  globalVariables: [],
  componentState: [],
  componentProps: {},
  templateElements: [],
};

interface RekaStateStore extends RekaState {
  // Global variables actions
  addGlobalVariable: (variable: GlobalVariable) => void;
  updateGlobalVariable: (id: string, updates: Partial<GlobalVariable>) => void;
  removeGlobalVariable: (id: string) => void;
  setGlobalVariables: (variables: GlobalVariable[]) => void;

  // Component state actions
  addComponentState: (variable: ComponentStateVariable) => void;
  updateComponentState: (id: string, updates: Partial<ComponentStateVariable>) => void;
  removeComponentState: (id: string) => void;
  setComponentState: (variables: ComponentStateVariable[]) => void;

  // Component props actions
  setComponentProps: (props: ComponentProps) => void;
  updateComponentProp: (key: string, value: unknown) => void;
  removeComponentProp: (key: string) => void;

  // Template elements actions
  addTemplateElement: (elementId: string) => void;
  removeTemplateElement: (elementId: string) => void;
  setTemplateElements: (elementIds: string[]) => void;

  // Reset actions
  resetState: () => void;
}

export const useRekaStateStore = create<RekaStateStore>((set) => ({
  // Initial state
  ...DEFAULT_STATE,

  // Global variables actions
  addGlobalVariable: (variable) =>
    set((state) => ({
      globalVariables: [...state.globalVariables, variable],
    })),

  updateGlobalVariable: (id, updates) =>
    set((state) => ({
      globalVariables: state.globalVariables.map((v) =>
        v.id === id ? { ...v, ...updates } : v
      ),
    })),

  removeGlobalVariable: (id) =>
    set((state) => ({
      globalVariables: state.globalVariables.filter((v) => v.id !== id),
    })),

  setGlobalVariables: (variables) =>
    set({
      globalVariables: variables,
    }),

  // Component state actions
  addComponentState: (variable) =>
    set((state) => ({
      componentState: [...state.componentState, variable],
    })),

  updateComponentState: (id, updates) =>
    set((state) => ({
      componentState: state.componentState.map((v) =>
        v.id === id ? { ...v, ...updates } : v
      ),
    })),

  removeComponentState: (id) =>
    set((state) => ({
      componentState: state.componentState.filter((v) => v.id !== id),
    })),

  setComponentState: (variables) =>
    set({
      componentState: variables,
    }),

  // Component props actions
  setComponentProps: (props) =>
    set({
      componentProps: props,
    }),

  updateComponentProp: (key, value) =>
    set((state) => ({
      componentProps: {
        ...state.componentProps,
        [key]: value,
      },
    })),

  removeComponentProp: (key) =>
    set((state) => {
      const { [key]: _, ...rest } = state.componentProps;
      return {
        componentProps: rest,
      };
    }),

  // Template elements actions
  addTemplateElement: (elementId) =>
    set((state) => ({
      templateElements: [...state.templateElements, elementId],
    })),

  removeTemplateElement: (elementId) =>
    set((state) => ({
      templateElements: state.templateElements.filter((id) => id !== elementId),
    })),

  setTemplateElements: (elementIds) =>
    set({
      templateElements: elementIds,
    }),

  // Reset actions
  resetState: () =>
    set(DEFAULT_STATE),
}));

