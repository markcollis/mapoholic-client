module.exports = {
  extends: 'airbnb',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'no-use-before-define': [0],
    '@typescript-eslint/no-use-before-define': ['error'],
    'no-unused-vars': [0],
    '@typescript-eslint/no-unused-vars': ['error'],
    'no-shadow': [0],
    '@typescript-eslint/no-shadow': ['error'],
    indent: [0],
    '@typescript-eslint/indent': ['error', 2],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'react/static-property-placement': [0],
    'react/state-in-constructor': [0],
    'react/jsx-props-no-spreading': [0],
    'arrow-body-style': [0],
    'no-undef': [0],
    'jsx-a11y/label-has-for': [0],
    'jsx-a11y/label-has-associated-control': [0],
    'import/extensions': [0],
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
  },
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  overrides: [
    {
      files: ['**/*.tsx'],
      rules: {
        'react/prop-types': [0],
      },
    },
  ],
};
