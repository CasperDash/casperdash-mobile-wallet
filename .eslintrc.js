module.exports = {
  root: true,
  extends: ['@react-native-community', 'prettier'],
  plugins: ['unused-imports'],
  rules: {
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'unused-imports/no-unused-imports': 'error',
  },
};
