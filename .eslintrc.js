module.exports = {
  root: true,
  extends: ['@react-native-community', 'prettier'],
  plugins: ['import', 'unused-imports'],
  rules: {
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'unused-imports/no-unused-imports': 'error',
    'import/order': [
      'error',
      {
        groups: [['builtin', 'external'], 'internal', 'parent', ['sibling', 'index'], 'object', 'type'],
        pathGroups: [
          {
            pattern: '@(react|react-native)',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@(utils|services|screens|navigation|redux_manager|components|assets|device)/**',
            group: 'internal',
          },
          {
            pattern: '@(utils|services|screens|navigation|redux_manager|components|assets|device)',
            group: 'internal',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
};
