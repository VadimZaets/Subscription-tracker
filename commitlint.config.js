// CommonJS: package.json тут без "type": "module" (Metro/Babel-конфіги теж CJS).
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-line-length': [1, 'always', 200],
  },
};
