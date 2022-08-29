// eslint-disable-next-line @typescript-eslint/no-var-requires
const cypressTypeScriptPreprocessor = require('./cy-ts-preprocessor');

module.exports = (on, config) => {
  // eslint-disable-next-line vue/max-len
  // eslint-disable-next-line global-require,import/no-extraneous-dependencies,@typescript-eslint/no-var-requires
  require('@cypress/code-coverage/task')(on, config);
  on('file:preprocessor', cypressTypeScriptPreprocessor);
  return config;
};
