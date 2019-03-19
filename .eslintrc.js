module.exports = {
  "extends": "airbnb",
  "parser": "babel-eslint",
  "rules": {
    "react/jsx-filename-extension": [1, {"extensions": [".js", ".jsx"]}],
    "arrow-body-style": [0],
    "jsx-a11y/label-has-for": [0],
    "jsx-a11y/label-has-associated-control": [0]
  },
  "env": {
    "browser": true,
    "node": true,
    "jest": true
  },
  "settings": {
    "import/resolver": {
      "node": {
        "paths": ["src"]
      }
    }
  }
};
