/**
 * Component Types
 * Types for component palette and component definitions
 */

export type ComponentCategory = 
  | 'commonly-used'
  | 'layout'
  | 'content'
  | 'form'
  | 'media'
  | 'navigation'
  | 'custom';

export type ComponentDefinition = {
  id: string;
  name: string;
  category: ComponentCategory;
  icon?: string;
  description?: string;
  defaultProps?: Record<string, unknown>;
  isContainer?: boolean;
};

export type ComponentPaletteState = {
  searchQuery: string;
  selectedCategory: ComponentCategory | 'all';
  components: ComponentDefinition[];
  filteredComponents: ComponentDefinition[];
};

