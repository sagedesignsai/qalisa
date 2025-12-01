/**
 * Editor History Store
 * Manages undo/redo history for editor state
 */

import { create } from 'zustand';
import type { HistoryState } from '../types/state.types';

const MAX_HISTORY_SIZE = 50;

interface EditorHistoryStore extends HistoryState {
  // History actions
  push: (state: unknown) => void;
  undo: () => unknown | null;
  redo: () => unknown | null;
  clear: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

const createHistoryStore = () => {
  return create<EditorHistoryStore>((set, get) => ({
    past: [],
    present: null,
    future: [],
    canUndo: false,
    canRedo: false,

    push: (state) => {
      const { present, past } = get();
      
      if (present === null) {
        // First state
        set({
          present: state,
          canUndo: false,
          canRedo: false,
        });
        return;
      }

      // Add current present to past
      const newPast = [...past, present].slice(-MAX_HISTORY_SIZE);
      
      set({
        past: newPast,
        present: state,
        future: [], // Clear future when new state is pushed
        canUndo: newPast.length > 0,
        canRedo: false,
      });
    },

    undo: () => {
      const { past, present } = get();
      
      if (past.length === 0 || present === null) {
        return null;
      }

      const previous = past[past.length - 1];
      const newPast = past.slice(0, -1);
      const newFuture = [present, ...get().future];

      set({
        past: newPast,
        present: previous,
        future: newFuture,
        canUndo: newPast.length > 0,
        canRedo: true,
      });

      return previous;
    },

    redo: () => {
      const { future, present } = get();
      
      if (future.length === 0 || present === null) {
        return null;
      }

      const next = future[0];
      const newFuture = future.slice(1);
      const newPast = [...get().past, present];

      set({
        past: newPast,
        present: next,
        future: newFuture,
        canUndo: true,
        canRedo: newFuture.length > 0,
      });

      return next;
    },

    clear: () => {
      set({
        past: [],
        present: null,
        future: [],
        canUndo: false,
        canRedo: false,
      });
    },

    canUndo: () => {
      return get().past.length > 0;
    },

    canRedo: () => {
      return get().future.length > 0;
    },
  }));
};

export const useEditorHistoryStore = createHistoryStore();

