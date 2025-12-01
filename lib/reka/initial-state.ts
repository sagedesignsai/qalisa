/**
 * Reka Initial State
 * Creates the initial Reka state structure
 */

import * as t from '@rekajs/types';

export const createInitialState = () => {
  return t.state({
    program: t.program({
      components: [
        t.rekaComponent({
          name: 'App',
          props: [],
          state: [],
          template: t.tagTemplate({
            tag: 'div',
            props: {},
            children: [],
          }),
        }),
      ],
    }),
  });
};

