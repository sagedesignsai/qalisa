/**
 * Component Palette Store
 * Manages component palette state: search, filters, components
 */

import { create } from 'zustand';
import type { ComponentPaletteState, ComponentDefinition, ComponentCategory } from '../types/component.types';

const DEFAULT_STATE: ComponentPaletteState = {
  searchQuery: '',
  selectedCategory: 'all',
  components: [],
  filteredComponents: [],
};

interface ComponentPaletteStore extends ComponentPaletteState {
  // Search actions
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;

  // Category actions
  setCategory: (category: ComponentCategory | 'all') => void;

  // Component actions
  setComponents: (components: ComponentDefinition[]) => void;
  addComponent: (component: ComponentDefinition) => void;
  removeComponent: (id: string) => void;

  // Filter logic (computed)
  updateFilteredComponents: () => void;
}

export const useComponentPaletteStore = create<ComponentPaletteStore>((set, get) => ({
  // Initial state
  ...DEFAULT_STATE,

  // Search actions
  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().updateFilteredComponents();
  },

  clearSearch: () => {
    set({ searchQuery: '' });
    get().updateFilteredComponents();
  },

  // Category actions
  setCategory: (category) => {
    set({ selectedCategory: category });
    get().updateFilteredComponents();
  },

  // Component actions
  setComponents: (components) => {
    set({ components });
    get().updateFilteredComponents();
  },

  addComponent: (component) => {
    set((state) => ({
      components: [...state.components, component],
    }));
    get().updateFilteredComponents();
  },

  removeComponent: (id) => {
    set((state) => ({
      components: state.components.filter((c) => c.id !== id),
    }));
    get().updateFilteredComponents();
  },

  // Filter logic
  updateFilteredComponents: () => {
    const { components, searchQuery, selectedCategory } = get();

    let filtered = components;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((c) => c.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.description?.toLowerCase().includes(query) ||
          c.category.toLowerCase().includes(query)
      );
    }

    set({ filteredComponents: filtered });
  },
}));

