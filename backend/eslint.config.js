// @ts-check
// ESLint configuration for DevSphere AI Backend
// Enforces consistent code style and catches common errors

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.env*',
      '*.log',
      'coverage/**'
    ]
  },
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'commonjs',
      globals: {
        // Node.js globals
        global: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        console: 'readonly',
        setImmediate: 'readonly',
        setInterval: 'readonly',
        setTimeout: 'readonly',
        clearImmediate: 'readonly',
        clearInterval: 'readonly',
        clearTimeout: 'readonly'
      }
    },
    rules: {
      // Possible Errors
      'no-console': ['warn', { allow: ['error', 'warn'] }],
      'no-debugger': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-empty': 'warn',
      'no-ex-assign': 'error',
      'no-extra-boolean-cast': 'warn',
      'no-invalid-regexp': 'error',
      'no-irregular-whitespace': 'error',
      'no-sparse-arrays': 'warn',
      'no-unreachable': 'error',
      'use-isnan': 'error',
      'valid-typeof': 'error',

      // Best Practices
      'curly': ['error', 'all'],
      'eqeqeq': ['error', 'smart'],
      'no-alert': 'warn',
      'no-caller': 'error',
      'no-case-declarations': 'error',
      'no-empty-function': 'warn',
      'no-eval': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'warn',
      'no-fallthrough': 'error',
      'no-global-assign': 'error',
      'no-implicit-coercion': 'warn',
      'no-implied-eval': 'error',
      'no-invalid-this': 'error',
      'no-new': 'warn',
      'no-octal': 'error',
      'no-redeclare': 'error',
      'no-return-assign': 'error',
      'no-self-assign': 'error',
      'no-throw-literal': 'error',
      'no-unused-labels': 'error',
      'no-with': 'error',
      'prefer-promise-reject-errors': 'warn',

      // Variables
      'no-delete-var': 'error',
      'no-label-var': 'error',
      'no-shadow': 'warn',
      'no-shadow-restricted-names': 'error',
      'no-undef': 'error',
      'no-unused-vars': ['error', { 
        args: 'after-used',
        argsIgnorePattern: '^_'
      }],
      'no-use-before-define': ['error', {
        functions: false,
        classes: true,
        variables: true
      }],

      // Stylistic Issues
      'array-bracket-spacing': ['warn', 'never'],
      'block-spacing': 'warn',
      'brace-style': ['warn', '1tbs'],
      'camelcase': ['warn', { properties: 'never' }],
      'comma-dangle': ['warn', 'never'],
      'comma-spacing': 'warn',
      'comma-style': ['warn', 'last'],
      'computed-property-spacing': ['warn', 'never'],
      'consistent-this': ['warn', 'self'],
      'eol-last': 'warn',
      'indent': ['warn', 2, { SwitchCase: 1 }],
      'key-spacing': ['warn', { beforeColon: false, afterColon: true }],
      'keyword-spacing': 'warn',
      'linebreak-style': ['warn', 'unix'],
      'max-len': ['warn', {
        code: 100,
        ignoreComments: true,
        ignoreUrls: true,
        ignorePattern: '^\\s*(TODO|FIXME|NOTE):'
      }],
      'new-cap': 'warn',
      'no-array-constructor': 'warn',
      'no-mixed-operators': 'warn',
      'no-mixed-spaces-and-tabs': 'error',
      'no-multiple-empty-lines': ['warn', { max: 2 }],
      'no-new-object': 'warn',
      'no-trailing-spaces': 'warn',
      'object-curly-newline': ['warn', { consistent: true }],
      'object-curly-spacing': ['warn', 'always'],
      'one-var': ['warn', 'never'],
      'operator-linebreak': ['warn', 'before'],
      'quotes': ['warn', 'single', { avoidEscape: true }],
      'semi': ['error', 'always'],
      'space-before-blocks': 'warn',
      'space-before-function-paren': ['warn', {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always'
      }],
      'space-in-parens': ['warn', 'never'],
      'space-infix-ops': 'warn',
      'space-unary-ops': 'warn',
      'spaced-comment': ['warn', 'always'],

      // Node.js
      'callback-return': 'warn',
      'global-require': 'warn',
      'handle-callback-err': 'warn',
      'no-mixed-requires': 'warn',
      'no-new-require': 'error',
      'no-path-concat': 'error'
    }
  }
];
