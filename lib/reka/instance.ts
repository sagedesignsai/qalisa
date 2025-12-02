/**
 * Reka Instance
 * Creates and configures the Reka instance
 */

import { Reka } from '@rekajs/core';
import * as t from '@rekajs/types';

export const createRekaInstance = () => {
  // Create a minimal Reka instance without externals for now
  // External components can be added later when we properly integrate RekaJS rendering
  // 
  // IMPORTANT: According to RekaExternalsFactory type:
  // - functions: Must be a factory function (reka: Reka) => StateExternalFunctions
  // - components: Array of Component types
  // - states: Array of ExternalState types
  return Reka.create({
    externals: {
      functions: () => [], // Factory function that receives Reka instance and returns functions array
      components: [], // Array of external components (t.Component[])
      states: [], // Array of external states (t.ExternalState[])
    },
    extensions: [],
  });
};

