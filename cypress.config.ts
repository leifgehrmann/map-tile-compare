// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'cypress';

export default defineConfig({
  video: false,
  e2e: {
    setupNodeEvents(on, config) {
      // eslint-disable-next-line max-len
      // eslint-disable-next-line import/extensions,@typescript-eslint/no-var-requires,global-require
      return require('./cypress/plugins/index.js')(on, config);
    },
    excludeSpecPattern: '*.js',
  },
});
