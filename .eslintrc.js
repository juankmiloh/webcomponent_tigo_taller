module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: ['eslint:recommended', 'airbnb-base', 'plugin:lit/recommended', 'prettier'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: ['lit', 'prettier'],
  ignorePatterns: [
    'node_modules',
    'src/**/**/dist/**',
    'scripts/**',
    'shared/utils/utilsFunctionsToTest.js',
  ],
  rules: {
    // 'prettier/prettier': [
    //   'error',
    //   {
    //     endOfLine: 'auto',
    //   },
    // ],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off',
    'arrow-body-style': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-param-reassign': 'off',
    'no-unused-expressions': 'off',
    'class-methods-use-this': 'off',
    camelcase: 'off',
    'import/no-relative-parent-imports': 'error',
    'no-underscore-dangle': 'off',
    'import/extensions': 'off',
  },
  overrides: [
    {
      files: ['webpack.config.js'],
      rules: {
        'import/no-dynamic-require': 'off',
        'global-require': 'off',
      },
    },
  ],
};
