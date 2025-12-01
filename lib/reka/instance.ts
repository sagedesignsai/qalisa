/**
 * Reka Instance
 * Creates and configures the Reka instance
 */

import { Reka } from '@rekajs/core';
import * as t from '@rekajs/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export const createRekaInstance = () => {
  return Reka.create({
    externals: {
      functions: [
        // Add external functions here
        // Example:
        // t.externalFunc({
        //   name: 'formatDate',
        //   func: (date: Date) => date.toLocaleDateString(),
        // }),
      ],
      components: [
        // Add external React components here
        t.externalComponent({
          name: 'Button',
          component: Button as any,
        }),
        t.externalComponent({
          name: 'Input',
          component: Input as any,
        }),
        t.externalComponent({
          name: 'Textarea',
          component: Textarea as any,
        }),
      ],
    },
    extensions: [
      // Add extensions here
    ],
  });
};

