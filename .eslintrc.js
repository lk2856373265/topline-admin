module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'skipBlankLines': true,
    // 'standard/no-callback-literal': 0
    "eslint.autoFixOnSave": true,
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
