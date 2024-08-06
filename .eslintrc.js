module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:jsx-a11y/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'import', 'jsx-a11y'],
  rules: {
    // Add custom rules here
    'react/prop-types': 'off',
    'import/no-unresolved': 'error',
    'jsx-a11y/anchor-is-valid': 'warn',
  },
}
