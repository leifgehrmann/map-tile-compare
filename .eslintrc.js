module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    '@vue/airbnb',
    '@vue/typescript',
  ],
  rules: {
    // While positive tab indexes are not recommended, I've been careful to properly index
    // all the inputs.
    'vuejs-accessibility/tabindex-no-positive': 'off',
  },
};
