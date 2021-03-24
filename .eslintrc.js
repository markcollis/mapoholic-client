module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'react/static-property-placement': [0],
    'react/state-in-constructor': [0],
    'react/jsx-props-no-spreading': [0],
    'arrow-body-style': [0],
    'jsx-a11y/label-has-for': [0],
    'jsx-a11y/label-has-associated-control': [0],
    'import/extensions': [0],
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
};
